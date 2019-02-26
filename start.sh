#!/bin/bash



DIRECTORY=$(cd `dirname $0` && pwd)
cd $DIRECTORY

cd ~/12ships/env
git reset --hard && git pull


cd ~/12ships/monitor-bitcoin-12

# export GOOGLE_APPLICATION_CREDENTIALS=/home/ec2-user/12ships/env/doc/google_12ships.json


SERVICE_MODE=$(env | grep SERVICE_MODE | grep -oe '[^=]*$');
echo "current SERVICE_MODE is $SERVICE_MODE"
if [ $SERVICE_MODE = live ]
then
	source ../env/12ships.live.env
    #git checkout master
else
	source ../env/12ships.test.env
    #git checkout test
fi

git reset --hard && git pull
npm -y install 
npm run build
pm2 delete monitor
pm2 start server.js --name 'monitor'


