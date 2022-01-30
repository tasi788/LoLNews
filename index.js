const url = "http://gameportal.garena.tw/homepage/api/info/get/"
const tg = "https://api.telegram.org/bot" + tgtoken + "/sendPhoto"
const fallback = "https://cdn1.telesco.pe/file/Mw8S9KcXuiwCBu474r0jgqDnTD5QkiLtSMWjWN59I8TQKeaAHLzAHLRMUm86kERT5zpNJFJREZktH4pTZPXFD5yfFZsQyymGLpv7dUSkyGmF0gx9l1LOr23RzrzvhlTzbEjOmd89-o4XKaa32iVua5IeqFnlJgKKRwUPrr5ULDaMQ8_6lUDJl6yNY8U-dBmubUO3Ct-o2XeTRPZLfz7AOTHITavs6kDhIJjQJQki1uVkLXY4_HtDx-Sz1Y4L_X3gKAka6nS93gmm_Jh3oDIG_Aw3pwmMTt_m5KdOD1mUU-pcvh4ClNRnC-m4UObJkZQh5OQ-PR5aDGF9kGiDnowNNw.jpg"

async function broadCast(data) {
    let value = await lolnews.get(data.item_id)
    if (value === null) {
        const keyboard = {
            inline_keyboard: [[
                {
                    text: "🔗 原文網址",
                    url: data.mobile_link
                }
            ]]
        }
        let payload = {
            chat_id: -1001420953823,
            photo: (data.image === undefined) ? fallback : data.image,
            caption: data.title + "\n#" + data.tag_name,
            reply_markup: keyboard
        }

        const init = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
        let resp = await fetch(tg, init)
        let result = await gatherResponse(resp)
        // console.log(await resp.json())
        console.log(result)
        if (resp.status === 200) {
            lolnews.put(data.item_id, 1, {expirationTtl: 2629746})
        }
    }
}

async function gatherResponse(response) {
    const {headers} = response
    const contentType = headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        return await response.json()
    } else if (contentType.includes("application/text")) {
        return response.text()
    } else if (contentType.includes("text/html")) {
        return response.text()
    } else {
        return response.text()
    }
}

async function handleRequest() {
    const JSONData = {
        "region": "tw",
        "uid": 0,
        "start": 0,
        "game_id": 32775,
        "size": 20,
        "version": "v1",
        "type": 0,
        "theme": "day"
    }
    const init = {
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 GarenaGas/2.9.3 (Apple iPhone; ios 15.2; zh-Hant-TW; TW; HTTPClient) light",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(JSONData),
    }
    const response = await fetch(url, init)
    const results = await gatherResponse(response)
    let iterData = results.result.items
    for (const x of iterData) {
        await broadCast(x)
    }
    return new Response(
        JSON.stringify({
            status: "ok"
        }, null, 2), {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
}

addEventListener("fetch", event => {
    return event.respondWith(handleRequest())
})