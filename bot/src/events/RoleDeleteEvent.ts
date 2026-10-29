// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete
import { AuditLogEvent, Role, TextChannel } from "discord.js";
import BaseEvent from "../utils/structures/BaseEvent";
import DiscordClient from "../client/client";

export default class RoleDeleteEvent extends BaseEvent {
  constructor() {
    super("roleDelete");
  }

  async run(client: DiscordClient, role: Role) {
    const config = client.configs.get(role.guild.id);
    const allowedServers = ["1088654212180738060", "1029217647314870313"];
    if (allowedServers.includes(role.guild.id)) {
      return;
    }
    if (!config) return;
    const ROLE_DELETE_THRESHOLD = 5;
    //if the role was deleted by the following bots ignore.
    const ALLOWED_BOTS = ["994738336566620201", "740689576275738645"];
    const auditLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
      limit: 1,
    });
    const firstEntry = auditLogs.entries.first();
    const executor = firstEntry?.executor;
    if (ALLOWED_BOTS.includes(executor!.id)) return;
    //Now I want to ban the executor that deleted the role if he deleted more than 3 roles in the last minute by the timestamp of the audit log
    const roleDeleteLogs = await role.guild.fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
      limit: 6,
    });
    const roleDeleteLogsArray = Array.from(roleDeleteLogs.entries.values());
    const roleDeleteLogsArrayFiltered = roleDeleteLogsArray.filter(
      (log) => log.executor?.id === executor!.id
    );
    const roleDeleteLogsArrayFilteredTimestamps =
      roleDeleteLogsArrayFiltered.map((log) => log.createdTimestamp);
    //sort timestamps from most recent to oldest
    roleDeleteLogsArrayFilteredTimestamps.sort((a, b) => b - a);
    //filter out the timestamps that are older than 1 minute
    const oldestTime = roleDeleteLogsArrayFilteredTimestamps[0];
    const roleDeleteLogsArrayFilteredTimestampsFiltered =
      roleDeleteLogsArrayFilteredTimestamps.filter(
        (timestamp) => timestamp > oldestTime - 60000
      );
    console.log(roleDeleteLogsArrayFilteredTimestampsFiltered);
    if (
      roleDeleteLogsArrayFilteredTimestampsFiltered.length >=
      ROLE_DELETE_THRESHOLD
    ) {
      await role.guild.members.ban(executor!.id, {
        reason: `Deletou ${roleDeleteLogsArrayFilteredTimestampsFiltered.length} cargos em menos de 1 minuto.`,
      });
    }
  }
}
