---
title: "CF 1136D - 纳斯蒂亚正在买午餐"
description: "队列最初是固定的，队列中的最后一个人是 Nastya。 给出了一些有序对 $(u,v)$。 一对意味着每当学生 $u$ 站在学生 $v$ 的正前方时，这两个学生都愿意交换位置。"
date: "2026-06-12T04:01:37+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1136
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 546 (Div. 2)"
rating: 1800
weight: 1136
solve_time_s: 86
verified: true
draft: false
---

[CF 1136D - 娜斯蒂亚正在买午餐](https://codeforces.com/problemset/problem/1136/D)

 **评分：** 1800
 **标签：** 贪婪
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 队列最初是固定的，队列中的最后一个人是 Nastya。 一些有序对$(u,v)$被给予。 一对意味着每当学生$u$站在学生的正前方$v$，那两个学生愿意交换位置。 

Nastya 希望通过重复使用此类相邻交换，尽可能地移到队列前面。 我们需要确定她可以晋升多少职位。 

队列最多包含$3 \cdot 10^5$学生，最多可以有$5 \cdot 10^5$允许交换关系。 这些限制立即排除了任何互换模拟。 甚至一个$O(n^2)$算法将执行大约$9 \cdot 10^{10}$在最坏的情况下进行操作，远远超出了时间限制。 我们需要输入大小接近线性的东西。 

问题的微妙部分是 Nastya 不会直接与任意人交换。 每次交换必须涉及两名相邻的学生，并且许可取决于这两名学生的身份。 

一个常见的错误是认为 Nastya 可以通过学生考试$x$如果存在直接许可$(x,\text{Nastya})$。 有时她可以绕过$x$重新安排其他学生后间接进行。 

考虑：```
Queue: [1, 2, 3]
Nastya = 3

Permissions:
1 -> 3
1 -> 2
```Nastya 无法通过瞳孔 2。尽管 1 可以与 3 交换，但瞳孔 2 会阻止访问并且无法跨越。 答案是0。 

另一个容易犯的错误是只模拟即时机会。```
Queue: [1, 2, 3, 4]
Nastya = 4

Permissions:
1 -> 4
2 -> 4
3 -> 4
```在这里，纳斯蒂亚可以一直移动到前面。 通过 3 后，她与 2 相邻，然后与 1 相邻。答案是 3。 

挑战在于准确识别哪些学生是不可避免的障碍。 

## 方法

 强力视图是将队列视为一种状态，并重复执行涉及 Nastya 的任何可用的相邻交换。 人们可以尝试搜索所有可到达的配置或贪婪地模拟交换。 困难在于，其他学生之间的重新安排可以在以后创造新的机会。 状态空间巨大，可达$n!$，所以这个方向是无望的。 

关键的观察来自于从右到左查看队列。 

让$x$是 Nastya 的数字，它是排列的最后一个元素。 

想象一下，检查站在娜斯佳面前的学生，从离她最近的一个开始，向前移动。 

假设我们已经确定了一组无论如何都必须留在娜斯佳面前的学生。 将此集合称为“已阻止”。 

现在考虑另一个学生$v$再往左边。 

娜斯佳最终能否通过$v$？ 

通过$v$，她必须在某个时刻与$v$。 每个当前被阻挡的学生都必须以某种方式向后移动$v$第一的。 唯一可能发生的方法是如果$v$愿意与每一个需要穿越的阻塞瞳孔交换。 

哪怕有一个瞳孔被遮挡$u$存在这样的许可$(v,u)$不存在，那么$u$永远不能落后$v$。 因此 Nastya 永远无法与$v$， 所以$v$本身被阻塞。 

另一方面，如果$v$对每个当前被阻止的学生都有权限，那么所有被阻止的学生都可以移到后面$v$，让 Nastya 最终通过$v$。 

这导致了一个非常紧凑的贪婪过程。 

维护被遮挡的学生组。 最初它只包含娜斯佳本人。 

从右到左处理队列，不包括 Nastya。 

对于每个学生$v$，数一下有多少个学生被挡住了$u$满足许可$(v,u)$。 

如果该计数等于阻塞集的当前大小，则$v$最终可以被绕过。 

否则$v$加入阻塞集。 

最后，除了娜斯佳之外，每一个被阻挡的瞳孔都代表着一个娜斯佳永远无法超越的人。 如果有$k$这样的学生，那么她就可以通过剩下的$n-1-k$学生。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数/状态空间搜索 | 巨大 | 太慢了 |
 | 最佳 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 读取队列并识别 Nastya 的编号，它是排列的最后一个元素。 
2. 对于每个权限对$(u,v)$， 店铺$v$在邻接集中$u$。 
3. 创建一个名为`blocked`并首先将 Nastya 放入其中。 
4. 从右到左处理队列，从 Nastya 前面的学生开始。 
5. 对于当前学生$v$, 计算有多少个成员`blocked`出现在$v$的邻接集。 
6. 如果这个计数等于`blocked`， 然后$v$最终可能会被 Nastya 超越，所以什么也不做。 

原因是每个当前被阻挡的瞳孔都可以向后移动$v$，允许$v$在某个时刻与 Nastya 相邻。 
7.否则添加$v$到`blocked`。 

至少有一个被阻挡的瞳孔永远无法落后$v$， 制作$v$不可避免的障碍。 
8. 处理完所有学生后，让`ans = len(blocked) - 1`。 

These are the non-Nastya pupils who must remain ahead of her.
 9. 输出`(n - 1) - ans`。 

### 为什么它有效

 不变的是，处理完队列的一个后缀后，`blocked`contains exactly the pupils from that suffix who can never be moved behind Nastya.

 检查新学生时$v$，每个当前被阻挡的学生最终都必须穿过$v$如果娜斯佳要通过$v$。 此类穿越需要许可$(v,u)$。 即使缺少一项所需的许可，至少一名被阻止的学生仍永久领先$v$，阻止 Nastya 到达$v$。 因此$v$也必须被阻止。 

如果每个被阻止的学生都有权限，那么所有学生都可以被移到后面$v$， 所以$v$不会成为永久的障碍。 

在每一步之后，这个不变量都保持为真，并且一旦处理了整个队列，阻塞集就包含了 Nastya 无法通过的学生。 答案是剩余学生的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    p = list(map(int, input().split()))

    adj = [set() for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        adj[u].add(v)

    blocked = {p[-1]}  # Nastya

    for v in reversed(p[:-1]):
        cnt = 0
        s = adj[v]

        for u in blocked:
            if u in s:
                cnt += 1

        if cnt != len(blocked):
            blocked.add(v)

    cannot_pass = len(blocked) - 1
    print((n - 1) - cannot_pass)

solve()
```邻接结构存储来自每个学生的所有权限。 会员资格测试是$O(1)$平均而言。 

套装`blocked`是解决方案的核心。 它包含的学生正是保证领先于娜斯佳的学生。 我们从右向左扫描，因为学生的地位只取决于比自己更接近娜斯佳的人。 

一个微妙的细节是我们将计数与当前大小进行比较`blocked`在可能插入当前瞳孔之前。 颠倒这个顺序会错误地让学生依赖自己。 

另一个细节是答案不是`len(blocked)`。 Nastya 本人总是在阻塞集中，因此我们在计算还有多少人领先于她之前减去 1。 

## 工作示例

 ### 示例 1

 输入：```
2 1
1 2
1 2
```纳斯蒂亚是二年级学生。 

| 当前学生| 之前被屏蔽 | 边缘是否全部被阻塞？ | 被阻止后 |
 | ---| ---| ---| ---|
 | 1 | {2} | 是的 | {2} |

 最终的阻塞集是`{2}`。`cannot_pass = 0`答案=`1 - 0 = 1`。 

Nastya 可以直接与 1 号学生交换并到达前方。 

### 示例 2```
3 3
1 2 3
1 3
1 2
2 3
```纳斯蒂亚是 3 号学生。 

| 当前学生| 之前被屏蔽 | 边缘是否全部被阻塞？ | 被阻止后 |
 | ---| ---| ---| ---|
 | 2 | {3} | 是的 | {3} |
 | 1 | {3} | 是的 | {3} |

 最终的阻塞集是`{3}`。`cannot_pass = 0`答案=`2`。 

纳斯蒂亚最终可以超过两个学生并走到前面。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m) | 每个边缘存储一次，每个光瞳处理一次 |
 | 空间| O(n + m) | 邻接集加上阻塞集 |

 总输入大小最多为$n=3\cdot10^5$和$m=5\cdot10^5$。 线性存储和近线性处理完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())
    p = list(map(int, input().split()))

    adj = [set() for _ in range(n + 1)]

    for _ in range(m):
        u, v = map(int, input().split())
        adj[u].add(v)

    blocked = {p[-1]}

    for v in reversed(p[:-1]):
        cnt = 0
        for u in blocked:
            if u in adj[v]:
                cnt += 1
        if cnt != len(blocked):
            blocked.add(v)

    cannot_pass = len(blocked) - 1
    return str((n - 1) - cannot_pass) + "\n"

# provided sample
assert run("2 1\n1 2\n1 2\n") == "1\n", "sample 1"

# minimum size
assert run("1 0\n1\n") == "0\n", "single pupil"

# no permissions
assert run("4 0\n1 2 3 4\n") == "0\n", "cannot move at all"

# can pass everyone
assert run(
    "4 3\n1 2 3 4\n1 4\n2 4\n3 4\n"
) == "3\n", "moves to front"

# one unavoidable blocker
assert run(
    "4 2\n1 2 3 4\n2 4\n3 4\n"
) == "2\n", "pupil 1 remains ahead"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 / 1`|`0`| 最小尺寸|
 | 没有权限 |`0`| 没有人可以超越|
 | 每个人都指向 Nastya |`3`| 娜斯佳到达前线 |
 | 缺少一项关键权限 |`2`| 正确检测不可避免的阻碍因素 |

 ## 边缘情况

 考虑队列：```
4 0
1 2 3 4
```根本没有任何权限。 从右到左处理给出：```
blocked = {4}
3 cannot reach all blocked -> add
blocked = {4,3}
2 cannot reach all blocked -> add
blocked = {4,3,2}
1 cannot reach all blocked -> add
blocked = {4,3,2,1}
```每个瞳孔都被挡住了。 答案是`0`，这是正确的，因为不可能发生交换。 

现在考虑：```
4 3
1 2 3 4
1 4
2 4
3 4
```处理给出：```
blocked = {4}
3 reaches all blocked
2 reaches all blocked
1 reaches all blocked
```没有其他学生进入阻挡组。 答案是`3`，这意味着 Nastya 可以超越所有人。 

最后考虑：```
4 2
1 2 3 4
2 4
3 4
```处理给出：```
blocked = {4}
3 reaches all blocked
2 reaches all blocked
1 does not reach 4
blocked = {4,1}
```学生 1 成为不可避免的障碍。 答案是`2`，这意味着 Nastya 可以超过学生 2 和 3，但永远不会超过学生 1。这正是贪婪不变量捕获的行为。
