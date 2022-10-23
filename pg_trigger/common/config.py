import yaml


def read_config(filename: str = "common/config.yaml"):
    try:
        f = open(filename)
        configs = yaml.load(f, Loader=yaml.FullLoader)
        return configs
    except:  # noqa
        print("[CONFIG] Cannot read config file")
        raise
