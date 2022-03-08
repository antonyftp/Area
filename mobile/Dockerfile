FROM androidsdk/android-30

# Set up Android SDK
RUN yes | sdkmanager --licenses

# Download Flutter SDK
WORKDIR /home/developer
RUN git clone https://github.com/flutter/flutter.git -b 2.8.1
ENV PATH "$PATH:/home/developer/flutter/bin"

WORKDIR /home/developer
COPY . .

CMD echo BASE_URL && echo ${BASE_URL} && flutter build apk --dart-define BASE_URL=${BASE_URL} && mv /home/developer/build/app/outputs/flutter-apk/app-release.apk /mobileapp/app.apk && ls /mobileapp