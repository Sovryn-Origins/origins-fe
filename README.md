# Sovryn DApp

---

## Browsers support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" /><br/>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /><br/>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Opera | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Brave |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| last 10 versions                                                                                                                                       | last 10 versions                                                                                                                                              | last 10 versions                                                                                                                                          | last 6 versions                                                                                                                                           | last 6 versions                                                                                                                                                           | last 10 versions                                                                                                                                      | last 10 versions                                                                                                                                      |

## Install & Start

Make sure you use at least version 10 of Node.js.

Install packages:

```shell
yarn
```

If you are using a Windows machine then you may receive errors when running this command, related to shell scripts in `/bin` not including the `.sh` file extension. To avoid this please run `yarn --ignore-scripts` instead, and execute the `gh-pack` script manually as needed.

Start DApp for development:

```shell
yarn start
```

Build for production:

```shell
yarn build
```

### Private dependecies

The DApp includes a private package as a dependency, for this reason you need get access to install it.
If your github account doesn't have 2FA enabled you can run this and provide your github credentials:

```
npm login --scope=@distributedcollective --registry=https://npm.pkg.github.com

> Username: [YOUR GITHUB USERNAME]
> Password: [YOUR GITHUB PASSWORD]
> EMAIL: [PUBLIC EMAIL ADDRESS]
```

If your github account uses 2FA (npm login authentication fails) then you need to create personal access token.
To authenticate by adding your personal access token to your `~/.npmrc` file (**file in your machine's user folder, not project folder!**), edit the ~/.npmrc file for your project to include the following line, replacing TOKEN with your personal access token. Create a new ~/.npmrc file if one doesn't exist.

```
//npm.pkg.github.com/:_authToken=TOKEN
```

[Instruction on how to create personal token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) - you will need `read:packages` permission.

Note: this step is only required if yarn install fails for you because of missing access to charting-library repository.
If yarn install fails after these steps please ask for read access to the charting-library repository (for external contributors please see the section below).

#### External Contributors

Due to the terms of our licensing agreement with Trading View, we are unable to grant access to the charting-library repository to external contributors. In order to allow running of this repo locally, we have set up the `development_external` and `master_external` branches which exclude this dependency and is synched to the latest changes from `development`/`master` branches.

Any new Pull Requests should target the non-external versions of these branches as outlined in the "Which Branch?" section below.

## Contributing

<a href="https://github.com/DistributedCollective/Sovryn-frontend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DistributedCollective/Sovryn-frontend" />
</a>

### Bug Reports

To foster active collaboration, Sovryn strongly encourages pull requests, not just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Abug+user%3Adistributedcollective).

### Support Questions

Sovryn's GitHub issue trackers are not intended to provide help or support. Instead, use one of the following channels:

- [Discord](https://discord.gg/J22WS6z)
- [Wiki Pages](https://wiki.sovryn.app)
- [Sovryn Forum](https://forum.sovryn.app)
- [Sovryn Blog](https://sovryn.app/blog/)

### Core Development Discussion

You may propose new features or improvements of existing DApp behavior in the Sovryn Ideas issue board. If you propose a new feature, please be willing to implement at least some of the code that would be needed to complete the feature.

Informal discussion regarding bugs, new features, and implementation of existing features takes place in the #sorcery channel of the Sovryn Discord server.

### Which Branch?

**All** bug fixes should be sent to the latest stable (master) branch. Bug fixes should never be sent to the development branch unless they fix features that exist only in the upcoming release.

**Minor** features that are fully backward compatible with the current release may be sent to the latest stable branch.

**Major** new features should always be sent to the development branch, which contains the upcoming release.

If you are unsure if your feature qualifies as a major or minor, please ask in the #sorcery channel of the Sovryn Discord server.

### Working With UI

All UI designs used for this repository should be available publically in [Google Drive folder as Adobe XD files](https://drive.google.com/drive/folders/1e_VljWpANJe0o4VmIkKU5Ewo56l9iMaM?usp=sharing)

## Security Vulnerabilities

If you discover a security vulnerability within DApp, please submit your bug report to [Immunefi](https://immunefi.com/bounty/sovryn/) (there is bounty rewards). All security vulnerabilities will be promptly addressed.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Licence

The Sovryn DApp is open-sourced software licensed under the [MIT license](LICENSE).
