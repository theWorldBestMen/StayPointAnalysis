import threading
from time import sleep
from typing import Callable, Any


def repeat_daemon(request_fn: Callable[..., Any], timeout, *args, **kwargs):
    while True:
        request_fn(*args, **kwargs)
        sleep(timeout)


def run_thread(request_fn: Callable[..., Any], timeout=1, *args, **kwargs):
    pass_args = (request_fn, *args)
    print(pass_args)
    thread = threading.Thread(target=repeat_daemon, args=(request_fn, timeout, *args), kwargs=kwargs)
    thread.daemon = True
    thread.start()


def prompt_in_terminal(prompt_str="."):
    print(prompt_str, end="", flush=True)
