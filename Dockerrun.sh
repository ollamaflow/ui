if [ -z "${IMG_TAG}" ]; then
  IMG_TAG='v1.0.0'
fi

echo Using image tag $IMG_TAG

docker run \
  -p 3000:3000 \
  -t \
  -i \
  -e "TERM=xterm-256color" \
  jchristn/ollamaflow-ui:$IMG_TAG
