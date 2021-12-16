import React from 'react';

const Aladin = (props) => {

    React.useEffect(() => {
        // TypeError: window.A is undefined --> Origin of the problem. Works well on a standalone app.
        // Code inspired from https://github.com/nvermaas/react-aladin-example/blob/master/src/pages/asteroids/Aladin.jsx
        let aladin = window.A.aladin('#aladin-lite-div', { survey: "P/Mellinger/color", fov:180.0 })
        aladin.setFov(props.fov)
        aladin.gotoRaDec(props.ra, props.dec)

        // create the catalog layer
        createLayers(aladin, props.data, props.tca, props.zadko)
        //console.log(props.tca);

    }, [])

    // create the catalog layer
    const createLayers = (aladin, data, tca, zadko) => {
        aladin.removeLayers()
        
        var overlay = window.A.graphicOverlay({color: '#ee2345', lineWidth: 2, name:'Zadko'});
        aladin.addOverlay(overlay);
        if(zadko){
            zadko.forEach(function (object){
                overlay.add(window.A.polyline(object));
            })
        }

        let overlay_TC = window.A.graphicOverlay({color: 'green', lineWidth: 2, name: 'TCA'});
        aladin.addOverlay(overlay_TC);

        if(tca){
            tca.forEach(function (object){
                overlay_TC.add(window.A.polyline(object));
            })
        }
        var json = 
            {'4': [1026, 1027, 1028, 1029, 1040, 1041, 1044, 1047, 1090, 1100, 1103, 1137, 1139, 1148, 1151, 2908], '5': [514, 520, 4099, 4102, 4103, 4120, 4121, 4124, 4125, 4128, 4168, 4169, 4172, 4173, 4180, 4182, 4183, 4184, 4185, 4187, 4354, 4364, 4366, 4367, 4372, 4373, 4378, 4384, 4385, 4388, 4389, 4391, 4404, 4406, 4407, 4408, 4409, 4418, 4419, 4428, 4456, 4458, 4459, 4462, 4501, 4544, 4545, 4547, 4553, 4568, 4570, 4571, 4598, 4601, 4949, 4951, 8856, 8905, 8907, 8911, 8922, 8923, 8949, 9120, 9123, 9126, 9133, 9144, 9147, 11611, 11613, 11614, 11615, 11623, 11627, 11628, 11629, 11636, 11637, 11638, 12043, 12064, 12065, 12066, 12072, 12074, 12160], '6': [680, 682, 2048, 2050, 2051, 2060, 2084, 2086, 2088, 2089, 2091, 2092, 2094, 2177, 2180, 16393, 16394, 16395, 16402, 16403, 16405, 16406, 16407, 16488, 16489, 16491, 16492, 16493, 16504, 16505, 16508, 16509, 16516, 16517, 16518, 16528, 16529, 16680, 16681, 16684, 16685, 16696, 16697, 16700, 16701, 16726, 16727, 16744, 16745, 16747, 16849, 16852, 16853, 17420, 17422, 17423, 17434, 17435, 17460, 17462, 17463, 17477, 17501, 17506, 17507, 17516, 17518, 17519, 17549, 17560, 17561, 17563, 17589, 17620, 17622, 17623, 17641, 17644, 17645, 17666, 17667, 17700, 17701, 17703, 17718, 17720, 17721, 17724, 17725, 17727, 17770, 17800, 17802, 17803, 17828, 17830, 17831, 17842, 17854, 17856, 17857, 18000, 18001, 18184, 18185, 18187, 18209, 18248, 18250, 18251, 18276, 18278, 18296, 18298, 18321, 18324, 18325, 18327, 18384, 18386, 18387, 18396, 18398, 18401, 18403, 18413, 18415, 19781, 19792, 19793, 19795, 19801, 19803, 19828, 19829, 19831, 19837, 35379, 35381, 35382, 35383, 35388, 35389, 35430, 35431, 35432, 35433, 35434, 35436, 35437, 35441, 35442, 35443, 35444, 35446, 35447, 35448, 35449, 35452, 35453, 35563, 35567, 35578, 35579, 35582, 35583, 35618, 35619, 35624, 35625, 35634, 35635, 35638, 35639, 35640, 35641, 35643, 35682, 35683, 35706, 35707, 35710, 35754, 35755, 35758, 35759, 35770, 35771, 35774, 35775, 35776, 35777, 35780, 35781, 35792, 35793, 35795, 35805, 35819, 36484, 36486, 36487, 36488, 36489, 36510, 36511, 36517, 36528, 36529, 36531, 36580, 36582, 36583, 36584, 36585, 36600, 36602, 36603, 36606, 46431, 46442, 46443, 46450, 46451, 46487, 46489, 46490, 46491, 46501, 46503, 46507, 46520, 46521, 46522, 46524, 46556, 46560, 46561, 46562, 46564, 46565, 46849, 46852, 47583, 47605, 47607, 47613, 47615, 47957, 47959, 47965, 47966, 47967, 47989, 47991, 48165, 48166, 48167, 48171, 48178, 48184, 48268, 48269, 48270, 48292, 48294, 48302, 48648, 48649, 48650, 48672], '7': [8196, 8198, 8199, 8248, 8250, 8251, 8360, 8361, 8363, 65565, 65566, 65567, 65617, 65618, 65619, 65960, 65961, 65962, 66984, 66985, 67392, 67393, 67420, 67421, 69642, 69643, 69844, 69846, 69847, 70000, 70001, 70003, 70120, 70122, 70123, 70192, 70193, 70195, 70248, 70249, 70251, 70352, 70353, 70355, 70588, 70589, 70591, 70656, 70658, 70659, 70760, 70762, 70763, 70788, 70789, 70791, 70904, 70905, 70907, 71224, 71226, 71227, 71316, 71318, 71319, 72052, 72053, 72055, 72744, 72745, 72747, 72968, 72970, 72971, 72996, 72998, 72999, 73116, 73118, 73119, 73304, 73305, 73307, 73332, 73333, 73335, 73540, 73542, 73543, 73648, 73649, 73651, 79176, 79177, 79179, 141782, 141783, 142265, 142266, 142267, 142466, 142467, 142470, 142471, 142568, 142569, 142571, 142816, 142818, 142819, 142844, 142846, 142847, 143176, 143177, 143179, 143272, 143274, 143275, 145964, 145965, 145967, 145992, 145994, 145995, 146032, 146034, 146035, 146164, 146165, 146167, 146216, 146218, 146219, 146348, 146349, 146351, 146404, 146406, 146407, 185757, 185758, 185759, 185797, 185798, 185799, 185941, 185942, 185943, 185945, 185946, 185947, 186009, 186010, 186011, 186228, 186229, 186230, 186255, 190325, 190327, 190457, 190459, 191825, 191827, 191833, 191835, 191857, 191859, 192677, 192678, 192679, 193084, 193086, 193200, 193201, 193202], '8': [745015, 745018, 745019], '9': [2980053, 2980054, 2980055, 2980057, 2980058, 2980059, 2980069, 2980070, 2980071]}

        var moc = window.A.MOCFromJSON(json, {opacity: 0.25, color: 'grey', lineWidth: 1, name: 'Bayestar'});
        aladin.addMOC(moc);
    }

    let title = "Skymap"

    return (
        <div>
            <h3>{title}</h3>
            <div id='aladin-lite-div' className="aladin"  />
        </div>
    )
}

export default Aladin
