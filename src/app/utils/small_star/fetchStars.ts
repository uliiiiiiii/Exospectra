import { SmallStar } from "@/types/small_star";
import stars_1 from "../../sky/star_data/stars.json" assert { type: "json" };
import stars_2 from "../../sky/star_data/stars2.json" assert { type: "json" };
import stars_3 from "../../sky/star_data/stars3.json" assert { type: "json" };
import stars_4 from "../../sky/star_data/stars4.json" assert { type: "json" };
import brightest_stars from "../../sky/star_data/brightest_stars.json" assert { type: "json" };

const STARS_JSON_URL = [
    stars_1,
    stars_2,
    stars_3,
    stars_4,
    brightest_stars,
];

let star_list: SmallStar[] = [];

export default async function getStars() {
    if (star_list.length > 0) {
        return star_list;
    } else {
        // alert(`start`);
        let global_id = 0;
        for (let i = 0; i < STARS_JSON_URL.length; i++) {
            try {
                for (let j = 0; j < Math.min(200000,STARS_JSON_URL[i].data.length); j++) {
                    // if (star_list.length > 10000) break;
                    // alert(`${stars_1.data[0]}`);
                    star_list.push({
                        id: global_id,
                        name: `${STARS_JSON_URL[i].data[j][0]}`,
                        ra: STARS_JSON_URL[i].data[j][1],
                        dec: STARS_JSON_URL[i].data[j][2],
                        distance: STARS_JSON_URL[i].data[j][4],
                        magnitude: STARS_JSON_URL[i].data[j][5],
                        bv_color: STARS_JSON_URL[i].data[j][6],
                        effective_temperature: STARS_JSON_URL[i].data[j][7],
                    });
                    global_id++;
                }
            } catch (error) {
                console.error("Error loading stars from JSON:", error);
                return [];
            }
        }
        // alert(`stars${star_list.length}`);
        return star_list;
    }
}