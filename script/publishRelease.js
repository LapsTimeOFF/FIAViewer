const {
    Octokit
} = require("octokit");
const {
    Writable
} = require('stream');

const conventionalChangelog = require('conventional-changelog');

const config = require('conventional-changelog-metahub');

const octokit = new Octokit({
    auth: process.env.GH_TOKEN
})

const publish = async () => {
    const {
        data
    } = await octokit.request('GET /repos/LapsTimeOFF/FIAViewer/releases', {
        owner: 'LapsTimeOFF',
        repo: 'FIAViewer'
    });

    console.log(data[0].id);

    var myStream = new Writable({
        write(chunk, encoding, callback) {
            // octokit.request('POST /repos/LapsTimeOFF/FIAViewer/releases', {
            //     owner: 'LapsTimeOFF',
            //     repo: 'FIAViewer',
            //     tag_name: `v${require('../package.json').version}`,
            //     target_commitish: 'stable',
            //     name: `v${require('../package.json').version}`,
            //     body: chunk.toString(),
            //     draft: true,
            //     prerelease: false,
            //     generate_release_notes: false
            // })

            octokit.request('PATCH /repos/LapsTimeOFF/FIAViewer/releases/{release_id}', {
                owner: 'LapsTimeOFF',
                repo: 'FIAViewer',
                release_id: data[0].id.toString(),
                body: chunk.toString(),
                draft: false
            })


            callback();
        }
    });
    // conventionalChangelog({
    //     config
    // }).pipe(myStream)

}

publish();