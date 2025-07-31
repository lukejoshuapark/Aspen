#!/bin/sh

curl -L -O https://dot.net/v1/dotnet-install.sh || exit 1
chmod u+x dotnet-install.sh || exit 1
./dotnet-install.sh -c ${DOTNET_VERSION} || exit 1
rm ./dotnet-install.sh || exit 1
export PATH="/root/.dotnet:$PATH"
export DOTNET_ROOT="/root/.dotnet"

dotnet tool install --global dotnet-ef || exit 1
export PATH="/root/.dotnet/tools:$PATH"
