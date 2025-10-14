import {
    faBell,
    faCamera,
    faFileExport,
    faFileImport,
    faFolder
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

// prettier-ignore
export const icons: Record<string, IconDefinition> = {
    'FolderNode': faFolder,
    'VideoChannelNode': faCamera,
    'DigitalInputNode': faFileImport,
    'DigitalOutputNode': faFileExport,
    'AlarmNode': faBell
}
