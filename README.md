# Client_and_Server

## Installation 
- in backend dir <br>
	1. create new virtual env
	2. `pip install -r requirement.txt`
	3. download traccar-server from [`https://www.traccar.org/download/`](url)

- in frontend dir <br>
	`npm install`

- in pg_trigger dir <br>
	1. create new virtual env
	2. `pip install -r requirements.txt`
   
## Setting (after installation)
- edit `currenddir/traccar-server/conf/traccar.xml`<br>
	```
	<entry key='database.driver'>~~</entry>
	<entry key='database.url'>~~</entry>
	<entry key='database.user'>~~</entry>
	<entry key='database.password'>~~</entry>
	```
- edit ~(project_dir)/backend/,env 
	- set your own info
	```
	PG_USER=*
	PG_PASSWORD=*
	PG_HOST=*
	PG_PORT=• 
	PG_DB=•
	
	MG_USER=*
	MG_PASSWORD=*
	MG_HOST=*
	MG_PORT=*
	MG_DB=*
	```

## How to Run
- in backend dir <br>
	` python manage.py runserver`
- in frontend dir <br>
	`npm start`  
- in pg_trigger dir <br>
  `python app.py`
- the way to turn on traccar server in traccar-other-5.3 dir <br>
	`java -jar tracker-server.jar conf/traccar.xml`

## Implementation
```python
├── backend
│   ├── config.py
│   ├── index.py
│   ├── main.py -> main src의 app을 
│   ├── manage.py
│   ├── setup.py
│   └── src
│       ├── app.py
│       ├── models.py 
│       └── utils
│           ├── auth.py
│           └── pytraccar
│               ├── api.py
│               ├── exceptions.py
├── frontend
│   ├── public
│   └── src
├── pg_trigger
│   ├── common
│   ├── pg_watcher
│   ├── positions
│   └── app.py
└── traccar-server
``` 
