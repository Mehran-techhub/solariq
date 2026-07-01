from config.settings import Config, DevelopmentConfig, ProductionConfig, TestingConfig

config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
