FROM centos:7
ENV container docker
RUN (cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == \
systemd-tmpfiles-setup.service ] || rm -f $i; done); \
rm -f /lib/systemd/system/multi-user.target.wants/*;\
rm -f /etc/systemd/system/*.wants/*;\
rm -f /lib/systemd/system/local-fs.target.wants/*; \
rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
rm -f /lib/systemd/system/basic.target.wants/*;\
rm -f /lib/systemd/system/anaconda.target.wants/*;
VOLUME [ "/sys/fs/cgroup" ]
CMD ["/usr/sbin/init"]

# node and npm
RUN yum -y update
RUN yum -y install epel-release
RUN yum -y install nodejs
RUN yum -y install npm
#
# tools
RUN yum -y install net-tools
RUN yum -y install curl
RUN yum -y install git
RUN yum -y install nano
RUN npm install -g bower

# wget
RUN yum -y install wget
RUN wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm
RUN yum -y localinstall jdk-8u131-linux-x64.rpm

RUN echo "root:root" | chpasswd

# kibana
RUN wget https://artifacts.elastic.co/downloads/kibana/kibana-6.2.4-x86_64.rpm
RUN rpm --install kibana-6.2.4-x86_64.rpm
COPY kibana.yml /etc/kibana/
RUN systemctl enable kibana
EXPOSE 5601

# Time Picker
RUN mkdir -p /usr/share/kibana/plugins
WORKDIR /usr/share/kibana/plugins
RUN git clone https://github.com/nreese/kibana-time-plugin.git
WORKDIR /usr/share/kibana/plugins/kibana-time-plugin
RUN bower install --allow-root
RUN sed -i 's/"version": "kibana"/"version": "kibana-6.2.4"/g' package.json

# Transform plugin – for conversion funnel
WORKDIR /usr/share/kibana/plugins
RUN git clone https://github.com/PhaedrusTheGreek/transform_vis.git
WORKDIR /usr/share/kibana/plugins/transform_vis
RUN npm install
RUN sed -i 's/"version": "kibana"/"version": "kibana-6.2.4"/g' package.json

# Radar Visual
WORKDIR /usr/share/kibana/plugins
RUN git clone https://github.com/dlumbrer/kbn_radar.git -b 6-dev
WORKDIR /usr/share/kibana/plugins/kbn_radar
RUN npm install
RUN sed -i 's/"version": "kibana"/"version": "kibana-6.2.4"/g' package.json