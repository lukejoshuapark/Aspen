FROM ghcr.io/lukejoshuapark/instant-coffee:0.8.1

RUN apt-get update
RUN apt-get install -y libicu-dev

ARG DOTNET_VERSION=8.0
COPY ./install-dotnet.sh ./
RUN chmod u+x ./install-dotnet.sh && ./install-dotnet.sh && rm ./install-dotnet.sh

ENV PATH="/root/.dotnet:$PATH"
ENV PATH="/root/.dotnet/tools:$PATH"
ENV DOTNET_ROOT="/root/.dotnet"
