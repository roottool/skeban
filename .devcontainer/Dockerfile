ARG VARIANT=${VARIANT:-"16-bullseye"}
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

ARG USERNAME=${USERNAME:-"node"}
ARG USER_UID=${USER_UID:-"1000"}
ARG USER_GID=${USER_UID}

ARG INSTALL_ZSH="true"
ARG ENABLE_NONROOT_DOCKER="true"
# * Upgrade OS packages to their latest versions.
ARG UPGRADE_PACKAGES="false"
# * Use the OSS Moby CLI instead of the licensed Docker CLI.
ARG USE_MOBY="true"

ARG SOURCE_SOCKET=/var/run/docker-host.sock
ARG TARGET_SOCKET=/var/run/docker.sock

ARG COMMON_DEBIAN_URL=https://raw.githubusercontent.com/microsoft/vscode-dev-containers/master/script-library/common-debian.sh
ARG DOCKER_DEBIAN_URL=https://raw.githubusercontent.com/microsoft/vscode-dev-containers/master/script-library/docker-debian.sh

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  # build-essential \
  bison \
  clang \
  # curl \
  gperf \
  libc6 \
  libdbus-1-dev \
  libgtk-3-dev \
  libnotify-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  openjdk-11-jdk \
  python-dbusmock \
  # * For arm64
  libc6-dev-arm64-cross \
  linux-libc-dev-arm64-cross \
  gcc-8-aarch64-linux-gnu \
  g++-8-aarch64-linux-gnu \
  gcc-aarch64-linux-gnu \
  g++-aarch64-linux-gnu \
  # * Add sudo support.
  sudo \
  && echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
  && chmod 0440 /etc/sudoers.d/${USERNAME} \
  && curl ${COMMON_DEBIAN_URL} -sSf | bash -s "${INSTALL_ZSH}" "${USERNAME}" "${USER_UID}" "${USER_GID}" "${UPGRADE_PACKAGES}" "true" "true" \
  # * Use Docker script from script library to set things up.
  && curl ${DOCKER_DEBIAN_URL} -sSf | bash -s "${ENABLE_NONROOT_DOCKER}" "${SOURCE_SOCKET}" "${TARGET_SOCKET}" "${USERNAME}" "${USE_MOBY}" \
  # * Avoiding extension reinstalls on container rebuild
  && mkdir -p /home/${USERNAME}/.vscode-server/extensions \
  # * Persist zsh history between runs
  && SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/home/${USERNAME}/commandhistory/.zsh_history" \
  && mkdir -p /home/${USERNAME}/commandhistory \
  && touch /home/${USERNAME}/commandhistory/.zsh_history \
  && echo ${SNIPPET} >> "/home/${USERNAME}/.zshrc" \
  && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME} \
  # * Clean up
  && apt autoremove -y \
  && apt clean -y \
  && rm -rf /var/lib/apt/lists/*

USER ${USERNAME}

ARG WORKING_DIR=/workspaces/skeban
WORKDIR ${WORKING_DIR}

ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]
CMD [ "sleep", "infinity" ]
