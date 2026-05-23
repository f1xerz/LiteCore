export const config = {
  commands: {
    namespace: "lite",
    cooldown: 5  // Кулдаун tpa/warp/home (сек)
  },

  prefix:    "§bʟɪᴛᴇᴄᴏʀᴇ §f»",
  admin_tag: "admin",

  // Теги для команд [ᴛᴇᴦ]
  tags: {
    fly:    "fly",
    repair: "repair",
    feed:   "feed",
    heal:   "heal",
    suicide:"suicide",
  },

  // Задержка телепортации по тегу (сек)
  delay_teleport: [
    { tag: "admin",  delay: 0 },
    { tag: "legend", delay: 3 },
    { tag: "hero",   delay: 5 },
  ],
  default_delay: 7,

  // Лимит домов (0 = безлимит)
  max_homes: [
    { tag: "admin",  limit: 0 },
    { tag: "legend", limit: 7 },
    { tag: "hero",   limit: 5 },
  ],
  default_max_homes: 3,

  // Scoreboard для баланса
  money_scoreboard: "Coins",

  // Время жизни tpa запроса (сек)
  keep_alive: 60,

  // ===== ОБЩИЕ СООБЩЕНИЯ =====
  Actionbar:              "§fТелепортация через §b%time% §fсек...",
  Actionbar_Cancel:       "§fТелепортация — §cотменена§f!",
  Cooldown_Message:       "§fПодождите §b%time% §fсек!",
  Damaged_Cancel_Message:     "§fВы получили §bурон §f— телепортация §cотменена§f!",
  Combat_Actionbar:          "§fПвП режим активен, до конца §b%время%",
  Teleported_Message:     "§fТелепортация...",
  Player_Is_Null:         "§fИгрок §cне в сети§f!",
  No_Permission:          "§fУ вас §cнет прав§f!",

  // ===== TPA =====
  Tpa_Is_Player:              "§fНельзя телепортироваться к §cсебе§f!",
  Already_A_TP_Request:          "§fУ вас уже есть активный запрос!",
  Timed_Out_Message:             "§fВаш запрос §cистёк§f!",
  Sending_Teleport_Request:      "§fЗапрос отправлен игроку §b%player%§f",
  Sent_Request_On_You:           "§b%player% §fпросит телепортироваться к вам!\n§f/lite:tpaccept §a(принять) §f/lite:tpadeny §c(отклонить)",
  Sent_Here_Request_On_You:      "§b%player% §fпросит телепортировать вас к себе!\n§f/lite:tpaccept §a(принять) §f/lite:tpadeny §c(отклонить)",
  No_Teleport_Requests:          "§fУ вас нет активных запросов!",
  Invalid_Player:                "§fИгрок §cвышел с сервера§f!",
  Teleport_Accepted_Sender:      "§b%player% §fпринял ваш запрос!",
  Teleport_Accepted_Receiver:    "§fВы приняли запрос §b%player%§f!",
  Rejected_Sender:               "§fВаш запрос §cотклонён§f!",
  Rejected_Receiver:             "§fВы отклонили запрос §b%player%§f!",
  Request_Cancelled:             "§fЗапрос §cотменён§f!",
  Enabled_TpAuto:                "§fАвтопринятие §aвключено§f!",
  Disabled_TpAuto:               "§fАвтопринятие §cвыключено§f!",
  Player_Has_Ignored_You:        "§fИгрок §cигнорирует вас§f!",
  TpaToggled_Player_Message:     "§fИгрок §cотключил §fприём запросов!",
  TpaToggle_Activated:           "§fПриём запросов §aвключён§f!",
  TpaToggle_Deactivated:         "§fПриём запросов §cвыключен§f!",
  Player_Is_Ignored:             "§fИгрок §cигнорируется§f!",
  Player_Unignored:              "§fИгрок больше §aне игнорируется§f!",
  TpaIgnore_Is_Player:           "§fНельзя игнорировать §cсебя§f!",

  // ===== WARP =====
  Warp_Not_Found:      "§fВарп §c%name% §fне найден!",
  Warp_Set:            "§fВарп §b%name% §fсоздан!",
  Warp_Deleted:        "§fВарп §c%name% §fудалён!",
  Warp_Already_Exists: "§fВарп §c%name% §fуже существует!",
  Warps_List:          "§fВарпы §7(%count%)§f:",
  Warps_Empty:         "§fНет доступных варпов!",
  Warp_Info:           "§fВарп §b%name%§f: §7%x%, %y%, %z% §f[§7%dim%§f]",

  // ===== SPAWN =====
  Spawn_Set:     "§fТочка спавна §aустановлена§f!",
  Spawn_No_Point:"§fТочка спавна §cне установлена§f!",

  // ===== HOME =====
  Home_Not_Found:      "§fДом §c%name% §fне найден!",
  Home_Set:            "§fДом §b%name% §fустановлен!",
  Home_Deleted:        "§fДом §c%name% §fудалён!",
  Home_Already_Exists: "§fДом §c%name% §fуже существует!",
  Homes_List:          "§fДома §b%player% §7(%count%)§f:",
  Homes_Empty:         "§fНет установленных домов!",
  Max_Homes_Reached:   "§fДостигнут лимит домов §c(%current%/%max%)§f!",

  // ===== ECO =====
  Balance_Message:     "§fБаланс §b%player%§f: §a%balance% §fмонет",
  Eco_Give:            "§fВыдано §a%amount% §fмонет игроку §b%player%§f",
  Eco_Take:            "§fСнято §c%amount% §fмонет у §b%player%§f",
  Eco_Set:             "§fБаланс §b%player% §fустановлен: §a%amount%§f",
  Eco_Reset:           "§fБаланс §b%player% §fсброшен!",
  Pay_Success:         "§fВы перевели §a%amount% §fмонет игроку §b%player%§f",
  Pay_Received:        "§b%player% §fперевёл вам §a%amount% §fмонет!",
  Pay_Not_Enough:      "§fНедостаточно §cмонет§f!",
  Pay_Toggle_On:       "§fПолучение переводов §aвключено§f!",
  Pay_Toggle_Off:      "§fПолучение переводов §cвыключено§f!",
  Pay_Toggled_Off:     "§fЭтот игрок §cне принимает §fпереводы!",
  Pay_Is_Playerd:      "§fНельзя перевести денги §cсебе§f!",

  // ===== GM =====
  Gm_Changed:          "§fРежим §b%player%§f: §e%mode%§f",
  Gm_Available : "§fДоступные режимы: §bsurvival§f, §bcreative§f, §badventure§f, §bspectator",

  // ===== MISC =====
  Fly_On:              "§fПолёт §aвключён§f!",
  Fly_Off:             "§fПолёт §cвыключен§f!",
  Repair_Hand:         "§fПредмет §aотремонтирован§f!",
  Repair_All:          "§fВсе предметы §aотремонтированы§f!",
  Repair_Nothing:      "§fНечего ремонтировать!",
  Feed_Message:        "§fГолод §aвосстановлен§f!",
  Heal_Message:        "§fЗдоровье §aвосстановлено§f!",
  Suicide_Message:     "§fВы §cпокинули §fэтот мир...",
}
