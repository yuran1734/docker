### installation :

* git clone https://github.com/yuran1734/docker
* cd docker
* docker build -t kibana .
* docker run -tid --privileged=true -v /sys/fs/cgroup:/sys/fs/cgroup:ro --name kibana -p 5601:5601 kibana
* wait about 10 mins
* navigate to http://localhost:5601/

### Credentials
* username: elastic
* password: mDnrUO1hP83GEckMktYdYg0G