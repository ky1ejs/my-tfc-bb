* https://www.runway.team/blog/how-to-set-up-a-ci-cd-pipeline-for-your-ios-app-fastlane-github-actions
* https://engineering.talkdesk.com/test-and-deploy-an-ios-app-with-github-actions-44de9a7dcef6
* https://github.com/fastlane/fastlane/issues/17744

## Fastlane + GitHub Actions
* https://github.com/fastlane/fastlane/issues/15518#issuecomment-544577677
* https://www.runway.team/blog/how-to-set-up-a-ci-cd-pipeline-for-your-ios-app-fastlane-github-actions

## Conflicting with Xcode Build numbers
I remember I had an issue with getting Fastline working with the build number, as it was not being accepted by App Store Connect (ASC), since Xcode Cloud was tracking the build version and setting it as the build number automatically. When disabling Xcode Cloud, the build number progress was lost.

I vaguely recall that the solution was with 2 changes: 
1. [update Fastlane to set the build number based on the previous build found in ASC + 1](https://github.com/ky1ejs/my-tfc-bb/commit/4cce06720ea7ee5582e082e96f234b72382fb148)
2. ~~set the app version number (MARKETING_VERSION) to a new value which resets the build and it can go to zero~~

Turns out change 2. wasn't ever done – the app version has always been 1.0... I defintely recall reading an Apple dev forum comment saying that if you really need to reset this, just bump the app version and then the project version (build number) can start again.
