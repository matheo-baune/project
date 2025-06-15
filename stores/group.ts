import { defineStore } from 'pinia';
import type { Group, User } from '~/types';
import { useUserStore } from './user';

export const useGroupStore = defineStore('group', {
    state: () => ({
        groups: [] as Group[],
        currentGroup: null as Group | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getUserGroups: (state) => {
            const userStore = useUserStore();
            const userId = userStore.currentUser?.id;

            if (!userId) return [];

            // Return groups where the user is a member or creator
            return state.groups.filter(group =>
                group.createdBy === userId ||
                group.members.some(member => member.id === userId)
            );
        },

        getGroupById: (state) => (id: string) => {
            return state.groups.find(group => group.id === id) || null;
        }
    },

    actions: {
        // Fetch all groups for the current user
        async fetchGroups() {
            this.loading = true;
            this.error = null;

            try {
                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                let response = await fetch('/api/groups', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId}),
                });

                if (!response.ok) {
                    this.error = 'Failed to fetch groups';
                    return [];
                }
                const data = await response.json();
                this.groups = data.groups as Group[];
                /*// Mock groups data
                this.groups = [
                  {
                    id: '1',
                    name: 'Family',
                    members: [
                      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff' },
                      { id: '2', name: 'Jane Doe', email: 'jane@example.com', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=EF4444&color=fff' }
                    ],
                    createdBy: '1',
                    background: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    id: '2',
                    name: 'Friends',
                    members: [
                      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff' },
                      { id: '3', name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=10B981&color=fff' }
                    ],
                    createdBy: '1',
                    background: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    id: '3',
                    name: 'Colleagues',
                    members: [
                      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff' },
                      { id: '4', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=F59E0B&color=fff' }
                    ],
                    createdBy: '1',
                    background: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                  }
                ];*/

                return this.groups;
            } catch (error) {
                this.error = 'Failed to fetch groups';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Fetch a single group by ID
        async fetchGroup(id: string) {
            this.loading = true;
            this.error = null;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const group = this.getGroupById(id);

                if (group) {
                    this.currentGroup = group;
                    return group;
                }

                this.error = 'Group not found';
                return null;
            } catch (error) {
                this.error = 'Failed to fetch group';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Create a new group
        async createGroup(name: string, members: User[], background?: string) {
            this.loading = true;
            this.error = null;

            try {
                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                if (!userId) {
                    this.error = 'User not authenticated';
                    return null;
                }

                const response = await fetch('/api/groups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, members, background, createdBy: userId }),
                });

                const data = await response.json() as Group;
                this.groups.push(data);
                return data;
            } catch (error) {
                this.error = 'Failed to create group';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Update an existing group
        async updateGroup(id: string, name: string, members: User[], background?: string) {
            this.loading = true;
            this.error = null;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                const groupIndex = this.groups.findIndex(group => group.id === id);

                if (groupIndex === -1) {
                    this.error = 'Group not found';
                    return null;
                }

                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                // Check if user is the creator of the group
                if (this.groups[groupIndex].createdBy !== userId) {
                    this.error = 'Not authorized to update this group';
                    return null;
                }

                // Ensure the creator is included in members
                const creatorIncluded = members.some(member => member.id === userId);
                if (!creatorIncluded && userStore.currentUser) {
                    members.push(userStore.currentUser);
                }

                // Update group
                this.groups[groupIndex] = {
                    ...this.groups[groupIndex],
                    name,
                    members,
                    background
                };

                return this.groups[groupIndex];
            } catch (error) {
                this.error = 'Failed to update group';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Delete a group
        async deleteGroup(id: string) {
            this.loading = true;
            this.error = null;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 600));

                const groupIndex = this.groups.findIndex(group => group.id === id);

                if (groupIndex === -1) {
                    this.error = 'Group not found';
                    return false;
                }

                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                // Check if user is the creator of the group
                if (this.groups[groupIndex].createdBy !== userId) {
                    this.error = 'Not authorized to delete this group';
                    return false;
                }

                // Delete group
                this.groups.splice(groupIndex, 1);

                if (this.currentGroup?.id === id) {
                    this.currentGroup = null;
                }

                return true;
            } catch (error) {
                this.error = 'Failed to delete group';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Add a member to a group
        async addMember(groupId: string, user: User) {
            this.loading = true;
            this.error = null;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const groupIndex = this.groups.findIndex(group => group.id === groupId);

                if (groupIndex === -1) {
                    this.error = 'Group not found';
                    return false;
                }

                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                // Check if user is the creator of the group
                if (this.groups[groupIndex].createdBy !== userId) {
                    this.error = 'Not authorized to add members to this group';
                    return false;
                }

                // Check if user is already a member
                const isMember = this.groups[groupIndex].members.some(member => member.id === user.id);

                if (isMember) {
                    this.error = 'User is already a member of this group';
                    return false;
                }

                // Add member
                this.groups[groupIndex].members.push(user);

                return true;
            } catch (error) {
                this.error = 'Failed to add member';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Remove a member from a group
        async removeMember(groupId: string, userId: string) {
            this.loading = true;
            this.error = null;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const groupIndex = this.groups.findIndex(group => group.id === groupId);

                if (groupIndex === -1) {
                    this.error = 'Group not found';
                    return false;
                }

                const userStore = useUserStore();
                const currentUserId = userStore.currentUser?.id;

                // Check if user is the creator of the group
                if (this.groups[groupIndex].createdBy !== currentUserId) {
                    this.error = 'Not authorized to remove members from this group';
                    return false;
                }

                // Check if trying to remove the creator
                if (userId === this.groups[groupIndex].createdBy) {
                    this.error = 'Cannot remove the creator from the group';
                    return false;
                }

                // Remove member
                const memberIndex = this.groups[groupIndex].members.findIndex(member => member.id === userId);

                if (memberIndex === -1) {
                    this.error = 'User is not a member of this group';
                    return false;
                }

                this.groups[groupIndex].members.splice(memberIndex, 1);

                return true;
            } catch (error) {
                this.error = 'Failed to remove member';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});
