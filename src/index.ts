import './stylesheet/main.scss';
import SampleScene from './Sample/KatachiBasicDemo';
import Katachi from './Katachi/Katachi';

window.onload = () => {
    fetch('./Dataset/katachi_basic_layout.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let katachi = new Katachi(myJson);
        let officialSampleScene = new SampleScene();
        officialSampleScene.SetUp(katachi);
    });
};