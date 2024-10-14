
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">

<h3 align="center">Remote Wind Tunnel Control System</h3>

  <p align="center">
    A system to remotely control and monitor wind tunnel experiments.
    <br />
    <br />
    <a href="https://github.com/zhenyulincs/RemoteMonitor/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/zhenyulincs/RemoteMonitor/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

The **Remote Wind Tunnel Control System** allows users to remotely control and monitor a wind tunnel experiment, focusing on fan control, wind speed monitoring, vibration displacement measurement, and real-time behavior monitoring via camera feed.

Key Features:
- **Fan Control**: Adjust fan on/off state and speed via a web interface.
- **Real-Time Monitoring**: Live camera feed for observing the testing object.
- **Wind Speed Monitoring**: Real-time wind velocity data using an anemometer.
- **Vibration Displacement Monitoring**: Displays a graph of vibration displacement over time.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]
* [![Arduino][Arduino.com]][Arduino-url]
* [![Python][Python.com]][Python-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- **Arduino IDE**: For working with Arduino scripts.
- **Python 3.11**: Required for running the wind speed and displacement monitoring scripts.

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/zhenyulincs/RemoteMonitor.git
   ```
2. Install required Python packages:
   ```sh
   pip install -r requirements.txt
   ```
3. Set up the Arduino PWM and ADC based on the [project instructions][Project-ppt].

4. Ensure all sensors are connected and the network is configured for remote monitoring.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->
## Usage

1. **Fan Control**: Use the web interface to control fan speed and observe the effects on the testing object.
   - To change the IP address of the Arduino fan control, go to the `fan-speed-controller.js` file located under the `js` folder and update the `sendData` function.

2. **Wind Speed**: View real-time wind velocity on the dashboard.
   - To get wind speed measurement working, connect the webserver computer with `testo405i` using Bluetooth, then run the Python script `testo405i_ble_data_server.py`.
   - Update the IP address in `wind-and-displacement-charts.js` under the `js` folder, in the `updateMeasuredWindSpeedChart` function.

3. **Vibration Monitoring**: Monitor the vibration displacement graph, showing time vs. offset in millimeters.
   - Run the Python script `displacement_data_stream.py`.
   - Update the IP address in the `wind-and-displacement-charts.js` file, in the `displacementSocket` variable.

4. **Camera Monitoring**: Observe the object behavior in real-time through the integrated camera feed.
   - Run the Python script `webcam_streaming_server.py`.
   - Update the IP address in `wind-and-displacement-charts.js`, in the `liveCameraSocket` variable.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/zhenyulincs/RemoteMonitor.svg?style=for-the-badge
[contributors-url]: https://github.com/zhenyulincs/RemoteMonitor/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/zhenyulincs/RemoteMonitor.svg?style=for-the-badge
[forks-url]: https://github.com/zhenyulincs/RemoteMonitor/network/members
[stars-shield]: https://img.shields.io/github/stars/zhenyulincs/RemoteMonitor.svg?style=for-the-badge
[stars-url]: https://github.com/zhenyulincs/RemoteMonitor/stargazers
[issues-shield]: https://img.shields.io/github/issues/zhenyulincs/RemoteMonitor.svg?style=for-the-badge
[issues-url]: https://github.com/zhenyulincs/RemoteMonitor/issues
[license-shield]: https://img.shields.io/github/license/zhenyulincs/RemoteMonitor.svg?style=for-the-badge
[license-url]: https://github.com/zhenyulincs/RemoteMonitor/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Arduino-url]: https://www.arduino.cc/
[Python-url]: https://www.python.org/
[Arduino.com]: https://img.shields.io/badge/-Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white
[Python.com]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Project-ppt]: https://www.dropbox.com/scl/fi/0u1h6me965sps390mhed0/Remote_Wind_Tunnel_Control_System.pptx?rlkey=tjs7hf37o1ftmyo0rrxto5vkd&st=donpceim&dl=0