const groups = [
    {
        "@Attachments": [],
        "@Metadata": {
            "created": "2025-09-11T12:12:25.8934563+00:00",
            "modified": "2025-09-15T11:15:51.6207438+00:00",
            "version": 3,
            "storageType": "Cosmos",
            "branch": "main",
            "type": "ChatGroup",
            "branchStatus": "updated"
        },
        "eid": "7c875320-0a9b-42f0-b49e-20a495797e34",
        "customName": "[UAT] Projektet",
        "integration": null,
        "startedBy": {
            "eid": "627013f0aa24b030fcc00111",
            "displayName": "Daniel Nilsson"
        },
        "members": [
            {
                "eid": "627013f0aa24b030fcc00111",
                "displayName": "Daniel Nilsson"
            },
            {
                "eid": "62625b69bf151d74012ac461",
                "displayName": "Mattias Wising Bonde"
            },
            {
                "eid": "624c0454bd2b0c4d51b34558",
                "displayName": "Therese Svedberg"
            }
        ],
        "lastMessage": {
            "eid": "d2ea4277-a20a-4248-8fc4-a58e9338fcf3",
            "body": "Test",
            "displayName": "Daniel Nilsson",
            "createdDate": "2025-09-12T08:28:48.936Z",
            "createdByEid": "627013f0aa24b030fcc00111",
            "readBy": {
                "62625b69bf151d74012ac461": "Mattias Wising Bonde"
            },
            "added": "2025-09-12T08:28:48.936Z",
            "updated": "2025-09-15T11:15:51.591Z"
        }
    },
    {
        "@Attachments": [],
        "@Metadata": {
            "created": "2025-09-11T12:12:21.8962753+00:00",
            "modified": "2025-09-15T11:15:36.4226690+00:00",
            "version": 2,
            "storageType": "Cosmos",
            "branch": "main",
            "type": "ChatGroup",
            "branchStatus": "updated"
        },
        "eid": "f0b80315-ffbf-46f7-8b13-fa84fa0907a1",
        "customName": null,
        "integration": null,
        "startedBy": {
            "eid": "62558d84f3144c3af9e5b720",
            "displayName": "Tina Lalander"
        },
        "members": [
            {
                "eid": "62558d84f3144c3af9e5b720",
                "displayName": "Tina Lalander"
            },
            {
                "eid": "62625b69bf151d74012ac461",
                "displayName": "Mattias Wising Bonde"
            }
        ],
        "lastMessage": {
            "eid": "aa911da3-f2ff-407b-8307-0f65226ab0b6",
            "body": "Ok tack 🙏",
            "displayName": "Tina Lalander",
            "createdDate": "2025-09-04T12:06:02.687Z",
            "createdByEid": "62558d84f3144c3af9e5b720",
            "readBy": {
                "62625b69bf151d74012ac461": "Mattias Wising Bonde"
            },
            "added": "2025-09-04T12:06:02.687Z",
            "updated": "2025-09-15T11:15:36.402Z"
        }
    },
    {
        "@Attachments": [],
        "@Metadata": {
            "created": "2025-09-11T12:12:21.8291491+00:00",
            "modified": "2025-09-11T12:12:21.8291491+00:00",
            "version": 1,
            "storageType": "Cosmos",
            "branch": "main",
            "type": "ChatGroup",
            "branchStatus": "created"
        },
        "eid": "1faa07cd-bb21-4599-8a41-d509c1a02719",
        "customName": null,
        "integration": null,
        "startedBy": {
            "eid": "62625b69bf151d74012ac461",
            "displayName": "Mattias Wising Bonde"
        },
        "members": [
            {
                "eid": "62625b69bf151d74012ac461",
                "displayName": "Mattias Wising Bonde"
            },
            {
                "eid": "638dd500b9113d3fcfed2d3b",
                "displayName": "Per Kasperi"
            }
        ],
        "lastMessage": null
    }
]

const members = [
    {
        eid: "62625b69bf151d74012ac461",
    },
    {
        eid: "62558d84f3144c3af9e5b720",
    }
];

function findGroupWithMembers(members, groups) {
    const getEid = (m) => (typeof m === 'string' ? m : m?.eid);

    const toEidSet = (list) => {
        const s = new Set();
        for (const m of list ?? []) {
            const eid = getEid(m);
            if (eid) s.add(eid);
        }
        return s;
    };

    const target = toEidSet(members);

    for (const group of groups ?? []) {
        const groupSet = toEidSet(group.members);
        if (groupSet.size !== target.size) continue;
        let exact = true;
        for (const eid of target) {
            if (!groupSet.has(eid)) { exact = false; break; }
        }
        if (exact) return group;
    }
    return null;
}

const matchingGroup = findGroupWithMembers(members, groups);
console.log(JSON.stringify(matchingGroup, null, 2));