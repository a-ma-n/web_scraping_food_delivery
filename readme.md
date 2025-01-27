# Start server locally

npm i
npm run start

## Commands to create a docker image:

docker build -t server-image .
docker run -p 8080:8080 -p 5901:5901 -p 80:80 --name server -v /Users/aman/Desktop/web_scraping_food_delivery/screenshots:/home/site/wwwroot/screenshots server-image

<!-- docker run --name server -d server-image
docker ps -->
