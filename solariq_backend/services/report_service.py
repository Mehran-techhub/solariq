import csv
import os
from datetime import datetime, timezone
from utils.pkt_timezone import PKT

from flask import current_app, send_file

from models.report import Report
from repositories.analytics_repository import AnalyticsRepository
from repositories.report_repository import ReportRepository
from utils.activity_logger import log_activity


class ReportService:
    @staticmethod
    def list_reports(user_id):
        reports = ReportRepository.list_by_user(user_id)
        summary = ReportService._build_summary(user_id)
        return {
            "reports": [r.to_dict() for r in reports],
            "summary": summary,
        }

    @staticmethod
    def generate(user_id, data):
        report_type = data["report_type"]
        report_name = data.get("report_name") or f"{report_type.title()} Report"
        fmt = (data.get("format") or "pdf").lower()

        os.makedirs(current_app.config["REPORTS_DIR"], exist_ok=True)
        timestamp = datetime.now(PKT).strftime("%Y%m%d_%H%M%S")
        safe_name = "".join(c if c.isalnum() or c in "-_" else "_" for c in report_name)

        if fmt == "csv":
            filename = f"{user_id}_{safe_name}_{timestamp}.csv"
            filepath = os.path.join(current_app.config["REPORTS_DIR"], filename)
            ReportService._write_csv(user_id, filepath, report_type)
        else:
            filename = f"{user_id}_{safe_name}_{timestamp}.pdf"
            filepath = os.path.join(current_app.config["REPORTS_DIR"], filename)
            ReportService._write_pdf(user_id, filepath, report_name, report_type)

        report = Report(
            user_id=user_id,
            report_type=report_type,
            report_name=report_name,
            file_path=filepath,
        )
        ReportRepository.create(report)
        log_activity(user_id, "Report generated", "reports")
        return report.to_dict()

    @staticmethod
    def download(user_id, report_id):
        report = ReportRepository.find_by_id(user_id, report_id)
        if not report or not os.path.isfile(report.file_path):
            return None
        ext = os.path.splitext(report.file_path)[1].lower()
        mimetype = "application/pdf" if ext == ".pdf" else "text/csv"
        return send_file(
            report.file_path,
            as_attachment=True,
            download_name=os.path.basename(report.file_path),
            mimetype=mimetype,
        )

    @staticmethod
    def _build_summary(user_id):
        monthly = AnalyticsRepository.get_by_period(user_id, "monthly")
        generation = monthly.generation if monthly else []
        consumption = monthly.consumption if monthly else []
        efficiency = monthly.efficiency if monthly else []
        total_gen = sum(generation)
        total_con = sum(consumption) if consumption else 0
        self_consumption = round((total_con / total_gen * 100) if total_gen > 0 else 0)
        avg_efficiency = round(sum(efficiency) / len(efficiency)) if efficiency else 0
        savings = round(total_gen * 18)  # Rs 18 per kWh average tariff
        return {
            "total_generation": total_gen,
            "self_consumption": self_consumption,
            "savings": savings,
            "efficiency": avg_efficiency,
            "weekly_production": generation[-4:] if len(generation) >= 4 else generation,
        }

    @staticmethod
    def _write_csv(user_id, filepath, report_type):
        monthly = AnalyticsRepository.get_by_period(user_id, "monthly")
        weekly = AnalyticsRepository.get_by_period(user_id, "weekly")
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["SolarIQ Energy Report", report_type])
            writer.writerow(["Generated", datetime.now(PKT).isoformat()])
            writer.writerow([])
            if weekly:
                writer.writerow(["Day", "Generation (kWh)", "Consumption (kWh)", "Efficiency %"])
                labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                for i, label in enumerate(labels[: len(weekly.generation)]):
                    writer.writerow([
                        label,
                        weekly.generation[i],
                        weekly.consumption[i] if i < len(weekly.consumption) else "",
                        weekly.efficiency[i] if i < len(weekly.efficiency) else "",
                    ])
            if monthly:
                writer.writerow([])
                writer.writerow(["Monthly Generation (kWh)"])
                for val in monthly.generation:
                    writer.writerow([val])

    @staticmethod
    def _write_pdf(user_id, filepath, title, report_type):
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.pdfgen import canvas
        except ImportError:
            raise RuntimeError("reportlab is required for PDF generation. Install it with: pip install reportlab")

        monthly = AnalyticsRepository.get_by_period(user_id, "monthly")
        c = canvas.Canvas(filepath, pagesize=letter)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, 750, "SolarIQ Energy Report")
        c.setFont("Helvetica", 12)
        c.drawString(50, 730, f"Title: {title}")
        c.drawString(50, 710, f"Type: {report_type}")
        c.drawString(50, 690, f"Generated: {datetime.now(PKT).strftime('%Y-%m-%d %H:%M PKT')}")
        y = 660
        if monthly:
            c.drawString(50, y, "Monthly Generation (kWh):")
            y -= 20
            for val in monthly.generation:
                c.drawString(70, y, f"- {val}")
                y -= 18
        c.save()
