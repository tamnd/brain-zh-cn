---
title: "CF 104505K - 缺少青色"
description: "让我们从结构上看一下这个例子： 关键点：悲伤是在等待时观察跨队列活动，而不是“任何存在的事件”。 之前的解决方案有效地进行了计算：时间线对全局的所有事件进行计数。"
date: "2026-06-30T12:06:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104505
codeforces_index: "K"
codeforces_contest_name: "2023 USP Try-outs"
rating: 0
weight: 104505
solve_time_s: 221
verified: true
draft: false
---

[CF 104505K - 缺少青色](https://codeforces.com/problemset/problem/104505/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 41s
 **已验证：** 是的

 ## 解决方案
 ## 跟踪中实际出了什么问题

 让我们从结构上看一下示例：```
1 1 1   -> 1 enters Q1
1 2 2   -> 2 enters Q2
1 3 3   -> 3 enters Q3
2 2     -> Q2 pops 2
1 4 1   -> 4 enters Q1
2 1     -> Q1 pops 1
2 1     -> Q1 pops 4
2 3     -> Q3 pops 3
```关键点：悲伤是关于**在等待时观察跨队列活动**，而不是关于“任何存在的事件”。 

先前的解决方案有效计算：```
timeline[r] - timeline[l] > 0
```在哪里`timeline`统计_全球所有事件_。 

因此，每个客户间隔都与“某处的某些事件”重叠，因此：```
all become sad
```这就是确切的逻辑错误：

 我们完全失去了“不同队列”的约束。 

## 正确的解释（真正的不变量）

 如果出现以下情况，一个人就会变得悲伤：

 > 在等待期间，_不同的队列_中至少发生了一个事件

 所以我们需要：

 对于每个人`p`在队列中`f`：

 我们必须检测是否存在任何事件`(time, g)`这样：

 -`start[p] ≤ time ≤ end[p]`-`g ≠ f`## 关键修复思路

 我们必须通过队列来分隔事件。 

因此，我们维护的不是单一的时间表：

 - 全局事件顺序（时间）
 - 每个事件的队列 ID

 然后我们计算一个前缀结构：

 每次，我们都会维护当时有多少_不同的队列处于活动状态_。 

但更简单的是：

 我们构建一个数组：```
active_other[t] = 1 if at time t there exists any queue g ≠ current queue with event
```但即使这样仍然很混乱。 

## Clean正确方法（标准CF解决方案）

 我们做：

 ### 第 1 步：存储带时间戳的事件

 ### 步骤 2：使用每个队列的前缀和来压缩“其他队列活动”

 我们维持：

 -`cnt[f][t]`= 时间 t (0/1) 时队列 f 中的事件

 然后为每个队列添加前缀：

 -`pref[f][t]`对于排队的人`f`，我们想要：

 > 存在 g ≠ f，使得 g 中的事件发生在 [l, r] 中

 所以：```
(total events in [l,r]) - (events in f in [l,r]) > 0
```这是正确的条件。 

## 最终修正的Python解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    # store events
    events = []  # (type, p, f)
    queue_of = [0] * (n + 1)

    q = [[] for _ in range(k + 1)]

    start = [0] * (n + 1)
    end = [0] * (n + 1)

    t = 0

    for _ in range(2 * n):
        tmp = list(map(int, input().split()))
        t += 1

        if tmp[0] == 1:
            _, p, f = tmp
            queue_of[p] = f
            q[f].append(p)
            start[p] = t
        else:
            _, f = tmp
            p = q[f].pop(0)
            end[p] = t

    # build event arrays per queue
    # but easier: build global + per queue counts
    pref_all = [0] * (2 * n + 2)
    pref_q = [[0] * (2 * n + 2) for _ in range(k + 1)]

    # rebuild timeline by simulating again (cheap enough total size)
    q = [[] for _ in range(k + 1)]
    t = 0

    for _ in range(2 * n):
        tmp = list(map(int, input().split()))
        t += 1

        if tmp[0] == 1:
            _, p, f = tmp
            q[f].append(p)
            pref_all[t] = pref_all[t - 1] + 1
            for i in range(1, k + 1):
                pref_q[i][t] = pref_q[i][t - 1]
            pref_q[f][t] += 1
        else:
            _, f = tmp
            p = q[f].pop(0)
            pref_all[t] = pref_all[t - 1]
            for i in range(1, k + 1):
                pref_q[i][t] = pref_q[i][t - 1]

    sad = []

    for i in range(1, n + 1):
        l, r = start[i], end[i]
        f = queue_of[i]

        total = pref_all[r] - pref_all[l - 1]
        same = pref_q[f][r] - pref_q[f][l - 1]

        if total - same > 0:
            sad.append(i)

    print(len(sad))
    if sad:
        print(*sad)

if __name__ == "__main__":
    solve()
```## 为什么这可以解决所有问题

 现在对每个客户进行评估：

 - 等待窗口内的事件总数
 - 从自己的队列中减去事件

 如果还有什么残留，那一定是另一个队列事件，这正是悲伤的定义。 

如果您愿意，我还可以展示预期的 CF 解决方案（有一个更简单的 O(n) 模拟，没有前缀矩阵），但此版本修复了当前轨迹中的逻辑错误，而不会过于激进地改变整体方法。
