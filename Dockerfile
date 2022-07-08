#################################
# First stage - build React app #
#################################
FROM node:16 as react-builder

RUN mkdir /home/node/app
WORKDIR /home/node/app

# Copy source code for React app
COPY client .
# Run npm install
RUN npm install
# Produce production React app
RUN npm run build

##################################
# Second stage - build Scala app #
##################################
FROM hseeberger/scala-sbt:11.0.13_1.5.8_2.13.7 as scala-builder
COPY . /root/
WORKDIR /root
# Copy production React app to public directory
COPY --from=react-builder /home/node/app/build public
# Compile Scala app
RUN sbt compile
RUN sbt dist
RUN mkdir build

# Expand zip into the directory
WORKDIR /root/build
RUN unzip ../target/universal/react-play-1.0-SNAPSHOT.zip

####################################
# Third stage - build Java web app #
####################################
FROM openjdk:11-jre-slim
COPY --from=scala-builder /root/build/react-play-1.0-SNAPSHOT /app

RUN addgroup nonroot --gid 1100 && \
  adduser nonroot --ingroup nonroot --uid 1100 --disabled-password && \
  chown -R nonroot:nonroot /app

USER nonroot
WORKDIR /app

CMD ["/app/bin/react-play"]
