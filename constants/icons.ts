import {
    faBell,
    faCamera,
    faFileExport,
    faFileImport,
    faFolder
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export const icons: Record<string, IconDefinition> = {
    FolderNode: faFolder,
    VideoChannelNode: faCamera,
    DigitalInputNode: faFileImport,
    DigitalOutputNode: faFileExport,
    AlarmNode: faBell
}
