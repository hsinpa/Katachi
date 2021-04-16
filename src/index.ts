import './stylesheet/main.scss';

window.onload = () => {
    fetch('./Dataset/color_wheel_config.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {

    });
};