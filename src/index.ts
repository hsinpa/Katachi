import './stylesheet/main.scss';
import SampleScene from './Sample/KatachiBasicDemo';
import Katachi from './Katachi/Katachi';

window.onload = () => {

    let katachi_config_promise = fetch('./Dataset/katachi_basic_layout.json');
    let sample_config_promise = fetch('./Dataset/sample_scene_layout.json');


    Promise.all([katachi_config_promise, sample_config_promise]).then(values => {
        return Promise.all(values.map(x=>x.json()));
      }).then(function(jsonArray) {
        let katachi = new Katachi(jsonArray[0]);
        let officialSampleScene = new SampleScene();
        officialSampleScene.SetUp(katachi, jsonArray[1]);
    });      
};