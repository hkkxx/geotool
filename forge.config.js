export default {
    authors:"hkx",
    packagerConfig: {

        name: 'geo-tool ', osxSign: {}, appCategoryType: 'public.app-category.developer-tools'
    }, makers: [{
        name: '@electron-forge/maker-zip', config: {
            language: 1033, manufacturer: 'hkx'
        }
    }
    ], plugins: []
};