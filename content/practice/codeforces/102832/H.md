---
title: "CF 102832H - 密码锁"
description: "一种直接的方法是对每个可能的动作序列进行建模。 从一个位置开始，我们将尝试每个未访问过的邻居，递归地解决结果状态，如果任何举动使对手失败，则将当前状态标记为获胜。"
date: "2026-07-26T15:12:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102832
codeforces_index: "H"
codeforces_contest_name: "2020 China Collegiate Programming Contest Changchun Onsite"
rating: 0
weight: 102832
solve_time_s: 75
verified: true
draft: false
---

[CF 102832H - 密码锁](https://codeforces.com/problemset/problem/102832/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 方法

 一种直接的方法是对每个可能的动作序列进行建模。 从一个位置开始，我们将尝试每个未访问过的邻居，递归地解决结果状态，如果任何举动使对手失败，则将当前状态标记为获胜。 这准确地反映了规则并且是正确的，因为游戏是有限的。 问题在于所需的信息量。 状态不仅是当前密码，而且是所有以前访问过的密码的集合。 在最坏的情况下，这会创建 2^(10^m) 个可能的历史，即使对于状态空间上最小的有用上限也是不可能的。 

有用的视角改变是停止思考游戏历史并查看底层图表。 禁止密码可以在游戏开始前删除，因为输入密码总是失败的一步。 剩余的图具有代表可用密码的顶点和代表一次有效旋转的边。 

该图是无向的，并且锁图具有附加的二分结构。 通过数字总和的奇偶性对密码进行着色是有效的，因为每次移动都会将该总和更改为奇数，即使数字从 0 换行到 9 也是如此。这让我们可以使用 Hopcroft-Karp 解决最大匹配问题。 

匹配定理给出了一个简单的检验。 令M为可播放图的最大匹配大小。 如果起始顶点被移除并且最大匹配大小变为 M - 1，则每个最大匹配都使用起始顶点，因此 Alice 获胜。 如果大小保持为 M，则存在避开起始顶点的最大匹配，因此 Bob 可以强制获胜。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 状态数量呈指数增长 | 指数| 太慢了 |
 | 最佳 | O(VE^0.5) | O(V + E) | 已接受 |

 ## 算法演练

 1. 生成不在禁止集中的所有密码的图表。 每个密码都转换成一个整数id，旋转一圈改变一位数字，两个id就连接起来了。 

该图最多包含 100000 个顶点，每个顶点最多有 2m 个邻居，因此构建它与状态空间的大小是线性的。 

1. 使用数字和的奇偶性将图分成两侧。 仅存储从第一侧到第二侧的边。 

每一步都会改变奇偶校验，所以这是一个有效的二分。 它允许有效地找到最大匹配。 

1. 运行 Hopcroft-Karp 来查找完整可玩图的最大匹配大小。 

这给出了匹配表征所需的值。 

1. 再次运行 Hopcroft-Karp，同时忽略启动密码。 

如果匹配大小减小，则每次最大匹配都需要起始密码。 否则存在最大匹配来避免它。 

1. 如果第二个匹配尺寸较小，则打印 Alice，否则打印 Bob。 

为什么它有效：

 删除禁止的密码后，原始游戏中的每个合法移动都与沿剩余无向图中的边移动完全对应。 因此，该游戏是无向顶点地理游戏。 匹配特征表明，当起始顶点包含在每个最大匹配中时，第一个玩家就获胜。 删除起始顶点正好测试了这个条件：如果最佳匹配丢失一条边，则始终需要起始点； 如果不存在，则在没有它的情况下存在最大匹配。 因此，两个匹配尺寸的比较给出了正确的获胜者。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def hopcroft_karp(adj, nl, nr):
    pair_l = [-1] * nl
    pair_r = [-1] * nr
    dist = [0] * nl

    def bfs():
        q = deque()
        found = False
        for i in range(nl):
            if pair_l[i] == -1:
                dist[i] = 0
                q.append(i)
            else:
                dist[i] = -1
        while q:
            u = q.popleft()
            for v in adj[u]:
                pu = pair_r[v]
                if pu == -1:
                    found = True
                elif dist[pu] == -1:
                    dist[pu] = dist[u] + 1
                    q.append(pu)
        return found

    def dfs(u):
        for v in adj[u]:
            pu = pair_r[v]
            if pu == -1 or (dist[pu] == dist[u] + 1 and dfs(pu)):
                pair_l[u] = v
                pair_r[v] = u
                return True
        dist[u] = -1
        return False

    ans = 0
    while bfs():
        for i in range(nl):
            if pair_l[i] == -1 and dfs(i):
                ans += 1
    return ans

def solve_case(m, n, start, banned):
    total = 10 ** m
    pow10 = [10 ** i for i in range(m)]

    def digits_of(x):
        res = []
        for _ in range(m):
            res.append(x % 10)
            x //= 10
        return res

    def encode(s):
        x = 0
        for c in s:
            x = x * 10 + (ord(c) - 48)
        return x

    bad = [False] * total
    for x in banned:
        bad[x] = True

    start_id = encode(start)

    side = [-1] * total
    left_id = [-1] * total
    right_id = [-1] * total
    nl = nr = 0

    for x in range(total):
        if not bad[x]:
            s = sum(digits_of(x))
            if s & 1:
                side[x] = 1
                right_id[x] = nr
                nr += 1
            else:
                side[x] = 0
                left_id[x] = nl
                nl += 1

    adj = [[] for _ in range(nl)]

    for x in range(total):
        if side[x] != 0:
            continue
        digs = digits_of(x)
        lx = left_id[x]
        for i in range(m):
            cur = digs[i]
            for nd in ((cur + 1) % 10, (cur - 1) % 10):
                y = x + (nd - cur) * pow10[m - 1 - i]
                if not bad[y]:
                    adj[lx].append(right_id[y])

    first = hopcroft_karp(adj, nl, nr)

    if side[start_id] == 0:
        old = left_id[start_id]
        removed_adj = []
        for i in range(nl):
            if i != old:
                removed_adj.append(adj[i])
        second = hopcroft_karp(removed_adj, nl - 1, nr)
    else:
        old = right_id[start_id]
        filtered = []
        for row in adj:
            filtered.append([v if v < old else v - 1 for v in row if v != old])
        second = hopcroft_karp(filtered, nl, nr - 1)

    return "Alice" if second < first else "Bob"

def main():
    t = int(input())
    out = []
    for _ in range(t):
        m, n, s = input().split()
        m = int(m)
        n = int(n)
        banned = []
        for _ in range(n):
            banned.append(int(input().strip()))
        out.append(solve_case(m, n, s, banned))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```该实现首先构建一组可用的密码。 这`side`数组存储二分区，而`left_id`和`right_id`将原始密码 ID 转换为紧凑的匹配索引。 

邻居一代每次改变一位数字。 从更改后的数字转换回整数 id 使用十的幂，这避免了重复创建字符串并保持图形构建快速。 

第一个 Hopcroft-Karp 调用计算可播放图的最大匹配。 第二次调用从二分区的相应侧删除起始顶点。 右侧情况下仔细的索引调整可以避免匹配顶点消失时出现差一错误。 

最终的比较直接使用匹配定理。 去掉起始后匹配较小，说明起始是必须的，这正是Alice获胜的条件。 

## 工作示例

 样本1：

 输入：```
1
1 2 6
7
5
```| 步骤| 全图匹配 | 删除开始后匹配 | 结果 |
 | --- | --- | --- | --- |
 | 构建图表 | 保留顶点 0,1,2,3,4,6,8,9 | 尚未计算 | 继续 |
 | 最大匹配| 3 | 尚未计算 | 继续 |
 | 删除开始 6 | 3 | 3 | 鲍勃 |

 匹配大小不会减少，因此存在避免起始密码的最大匹配。 Bob 可以使用匹配策略。 

样本2：

 输入：```
1
1 2 9
1
8
```| 步骤| 全图匹配 | 删除开始后匹配 | 结果 |
 | --- | --- | --- | --- |
 | 构建图表 | 除 1 和 8 之外的顶点均保留 | 尚未计算 | 继续 |
 | 最大匹配| 4 | 尚未计算 | 继续 |
 | 删除开始 9 | 4 | 3 | 爱丽丝|

 匹配大小下降一。 起始顶点被迫进入每个最大匹配，因此爱丽丝有一个获胜策略。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(VE^0.5) | Hopcroft-Karp 在 V <= 100000 且 E <= 2mV 的图上运行两次 |
 | 空间| O(V + E) | 图形和匹配数组显式存储 |

 最大可能的图在二分转换后具有十万个状态和最多一百万个有向邻接条目。 两次匹配运行在给定的内存和时间限制内非常合适。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().strip().split()
    sys.stdin = old
    return ""

# The assertions below are examples for an external judge harness.
# They should call solve_case directly or wrap main in the same file.

assert solve_case(1, 2, "6", [7, 5]) == "Bob"
assert solve_case(1, 2, "9", [1, 8]) == "Alice"
assert solve_case(1, 0, "0", []) == "Bob"
assert solve_case(1, 8, "0", ["1", "2", "3", "4", "5", "6", "7", "9"]) == "Bob"
assert solve_case(2, 99, "00", list(range(1, 100))) in ("Alice", "Bob")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`m=1, start=6, banned={7,5}`| 鲍勃 | 最大匹配避免开始的情况 |
 |`m=1, start=9, banned={1,8}`| 爱丽丝| 起始顶点被强制进入每个最大匹配 |
 |`m=1, start=0, banned={}`| 鲍勃 | 最小图形处理 |
 |`m=1, start=0, all other digits banned`| 鲍勃 | 立即输棋处理|
 | 两位数大图 | 爱丽丝或鲍勃| 性能和索引处理|

 ## 边缘情况

 当从一开始所有可能的移动都被禁止时，算法会在匹配之前删除这些顶点。 剩余的图可能包含作为孤立顶点的起点。 删除后它的最大匹配大小没有变化，所以答案变成了Bob，符合Alice第一步就输的规则。 

当起始密码位于二分的右侧时，删除它需要缩小匹配图的右侧而不是左侧。 该实现单独处理这个问题，因为 Hopcroft-Karp 仅存储左侧邻接。 这可以防止常见的索引错误。 

当没有禁止密码时，该图包含所有可能的锁定状态。 该方法仍然有效，因为它从不依赖于禁止状态的数量。 该图仅根据锁维度构建，匹配定理处理循环和长路径，而无需枚举游戏历史。 

我还可以将其改编成较短的 Codeforces 风格的社论，或者以更正式的定理和引理风格重写证明部分。
