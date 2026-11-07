---
title: "CF 1949F - 约会"
description: "每个用户都可以被视为一组活动。 我们需要找到两个用户，其集合同时满足三个条件： 1. 他们至少共享一项活动。 2.第一用户具有第二用户没有的至少一个活动。 3."
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1949
codeforces_index: "F"
codeforces_contest_name: "European Championship 2024 - Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 2200
weight: 1949
solve_time_s: 117
verified: false
draft: false
---

[CF 1949F - 约会](https://codeforces.com/problemset/problem/1949/F)

 **评分：** 2200
 **标签：** 贪婪、排序、树
 **求解时间：** 1m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个用户都可以被视为一组活动。 

我们需要找到两个用户，其集合同时满足三个条件：

 1. 他们至少共同从事一项活动。 
2.第一用户具有第二用户没有的至少一个活动。 
3.第二用户具有第一用户没有的至少一个活动。 

在集合术语中，我们正在寻找交集非空的两个集合，但两个集合都不是另一个集合的子集。 

输入最多包含 200,000 个用户，但所有用户列出的活动总数最多为 1,000,000 个。 第二个界限是关键的一个。 这意味着我们可以承担与输入数据总量成正比的工作，但我们无法承担比较每一对用户的费用。 

对所有对进行强力检查大约需要$$\binom{200000}{2} \approx 2 \cdot 10^{10}$$比较，这是完全不可能的。 

活动宇宙非常大，可达$10^6$，但最多只能$10^6$活动事件实际出现。 任何解决方案都应该适用于输入中发生的活动，而不是尝试构建大小的结构$m$。 

一些边缘情况很容易被错误处理。 

考虑两个相同的用户：```
2 3
2 1 2
2 1 2
```正确答案是`NO`。 他们共享活动，但两个用户都拥有对方所缺乏的东西。 仅检查非空交集的解决方案将错误地返回`YES`。 

考虑两个不相交的用户：```
2 3
1 1
1 2
```正确答案是`NO`。 每个用户都有独特的活动，但他们不共享任何内容。 

考虑子集关系：```
2 4
1 1
2 1 2
```正确答案是`NO`。 他们共享活动 1，但第一组包含在第二组内。 两个用户都必须拥有对方所没有的东西。 

最后一个微妙的情况是许多用户包含完全相同的活动。 仅查看活动频率是不够的。 我们必须区分相同集合和不可比较集合。 

## 方法

 最直接的解决方案是对每对用户进行比较。 

对于一对套装$A$和$B$，我们可以检查是否：$$A \cap B \neq \varnothing$$和$$A \setminus B \neq \varnothing$$和$$B \setminus A \neq \varnothing.$$这是正确的，因为它直接实现了良好匹配的定义。 

问题是对的数量。 拥有 200,000 个用户，大约有 200 亿对。 即使每次比较都极其便宜，但这也远远超出了极限。 

为了取得进步，我们需要利用约束的特殊结构。 

关键的观察结果是，活动发生的总数仅为$10^6$。 这暗示了一个经典的重轻理念。 

如果某个活动出现在许多用户中，则称该活动为“重”活动，否则称为“轻”活动。 

假设我们选择一个阈值$$B \approx \sqrt{10^6}=1000.$$最多可以有大约 1000 个重度活动，因为每个重度活动至少贡献$B$出现次数且总出现次数最多为$10^6$。 

现在考虑一个用户集$S$。 

如果$|S| \ge B$，我们称之为重度用户。 最多也可以有大约 1000 个重度用户，因为所有集合的总大小最多为$10^6$。 

这种平方根分解创建了两个可管理的世界。 

对于重度用户来说，只有1000人左右。 我们可以建立快速的会员结构并对其进行有效的比较。 

对于轻度用户，每组包含少于$B$活动。 我们可以通过活动发生率列表来处理它们。 由于每个灯组都很小，总工作量仍然接近$O(10^6 \sqrt{10^6})$。 

关键的特性是两个用户在相交时完全匹配，但在包含时则无法比较。 

编辑解决方案在集合之间构建包含信息，并仅在实际共享活动的对之间进行搜索，从而避免了二次爆炸。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2 \cdot k)$|$O(1)$| 太慢了|
 | 最佳 |$O(T\sqrt{T})$， 在哪里$T=\sum k_i$|$O(T)$| 已接受 |

 ## 算法演练

 让$$T=\sum k_i.$$选择$$B=\lfloor\sqrt{T}\rfloor+1.$$将每个用户的活动表示为排序列表。 

### 1. 将所有活动事件压缩到事件列表中

 对于每个活动，存储包含该活动的用户。 

这使我们能够仅枚举实际上共享至少一项活动的用户对。 

### 2. 将用户分为重度或轻度

 如果用户的设置大小至少为$B$。 

由于所有集合的总大小为$T$，重度用户数最多为$T/B = O(\sqrt T)$。 

这个界限使得后续处理变得可行。 

### 3. 为重度用户建立快速的会员结构

 对于每个重度用户，将其所有活动存储在哈希表中。 

这让我们可以在恒定的预期时间内测试成员资格。 

### 4.针对所有用户处理重度用户

 对于重度用户$H$，计算与每个用户的交集计数。 

迭代每个活动$H$。 对于包含该活动的每个用户，增加一个计数器。 

扫描后，对于任何用户$U$，计数器等于$$|H \cap U|.$$现在检查是否$$0 < |H\cap U| < |H|$$和$$0 < |H\cap U| < |U|.$$这些不平等意味着：

 - 交集非空，
 -$H$外面有东西$U$,
 -$U$外面有东西$H$。 

如果它们成立，我们就找到了有效的对。 

### 5. 处理轻用户对

 每个轻用户包含少于$B$活动。 

对于每个活动，查看包含该活动的轻度用户列表。 

每当两个轻度用户通过某项活动相遇时，他们就会共享至少一项活动。 

我们必须确定一个是否是另一个的子集。 

将候选对存储在计数结构中。 对于每个共享活动，增加该对的共同活动计数。 

处理完所有活动后，一对$(A,B)$有价值$$c = |A \cap B|.$$这对组合恰逢其时$$c > 0,$$

$$c < |A|,$$和$$c < |B|.$$如果这些条件成立，则两个集合都不完全包含另一个集合，并且它们至少共享一个活动。 

### 6.输出第一个有效对

 如果任何阶段找到有效的对，则打印`YES`以及相应的指数。 

如果所有检查均未成功完成，则打印`NO`。 

### 为什么它有效

 对于共享活动的每对用户，算法会计算其交集的确切大小。 

仅当交集严格小于两个设定大小时才接受一对。 这意味着每个用户在路口外至少拥有一项活动。 同样，两个集合都不包含在另一个集合中。 

只要交集为空或等于其中一个设定大小，一对就会被拒绝。 在这些情况下，用户要么不共享任何内容，要么一个配置文件是另一个配置文件的子集，这违反了良好匹配的定义。 

重度用户处理检查所有涉及重度用户的对。 轻用户处理检查所有完全由轻用户组成的对。 每个可能的对都恰好属于这些类别之一，因此不会错过任何有效答案。 

## Python 解决方案```python
import sys
from math import isqrt
from collections import defaultdict

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    sets = []
    total = 0
    activity_users = defaultdict(list)

    for idx in range(n):
        row = list(map(int, input().split()))
        k = row[0]
        arr = row[1:]
        sets.append(arr)
        total += k

        for x in arr:
            activity_users[x].append(idx)

    B = isqrt(max(total, 1)) + 1

    heavy = []
    is_heavy = [False] * n

    for i in range(n):
        if len(sets[i]) >= B:
            is_heavy[i] = True
            heavy.append(i)

    # Heavy versus all users
    cnt = [0] * n

    for h in heavy:
        touched = []

        for act in sets[h]:
            for u in activity_users[act]:
                if cnt[u] == 0:
                    touched.append(u)
                cnt[u] += 1

        hs = len(sets[h])

        for u in touched:
            if u == h:
                continue

            c = cnt[u]

            if c > 0 and c < hs and c < len(sets[u]):
                print("YES")
                print(h + 1, u + 1)
                return

        for u in touched:
            cnt[u] = 0

    # Light-light pairs
    pair_cnt = defaultdict(int)

    for users in activity_users.values():
        light_users = [u for u in users if not is_heavy[u]]

        s = len(light_users)

        for i in range(s):
            a = light_users[i]
            for j in range(i + 1, s):
                b = light_users[j]
                if a > b:
                    a, b = b, a
                pair_cnt[(a, b)] += 1

    for (a, b), c in pair_cnt.items():
        if c < len(sets[a]) and c < len(sets[b]):
            print("YES")
            print(a + 1, b + 1)
            return

    print("NO")

if __name__ == "__main__":
    solve()
```第一部分读取所有集合并同时构建活动发生率列表。 这些事件列表是解决方案的核心结构，因为未来的每个操作都是由共享活动驱动的。 

重度用户阶段永远不会将重度用户与其他用户的每项活动进行比较。 相反，它会遍历重度用户的活动并累积精确的交叉点大小。 这`touched`数组记录哪些计数器变为非零，以便清理与执行的实际工作保持成比例。 

轻-轻阶段统计每对实际共享某些内容的轻用户的共同活动。 从不共享活动的对永远不会被存储，这对于效率至关重要。 

条件```
c < len(sets[a]) and c < len(sets[b])
```是“两个用户至少有一项对方所缺乏的活动”的精确数学翻译。 由于每个存储对已经有`c > 0`，这充分描述了有效匹配。 

不存在整数溢出问题，因为所有计数最多为$10^6$，完全在 Python 的整数范围内。 

## 工作示例

 ### 示例 1

 输入：```
3 5
3 1 2 4
5 1 2 3 4 5
2 1 5
```| 配对| 交叉口尺寸| A 号 | B 号 | 有效 |
 | --- | --- | --- | --- | --- |
 | (1,2) | 3 | 3 | 5 | 没有 |
 | (1,3) | 1 | 3 | 2 | 是的 |
 | (2,3) | 2 | 5 | 2 | 没有 |

 该对 (1,3) 共享活动 1。用户 1 另外还有活动 2 和 4，而用户 3 另外还有活动 5。两个方向都包含唯一的活动，因此该对被接受。 

### 示例 2

 输入：```
2 4
1 1
2 1 2
```| 配对| 交叉口尺寸| A 号 | B 号 | 有效 |
 | --- | --- | --- | --- | --- |
 | (1,2) | 1 | 1 | 2 | 没有 |

 交集等于整个第一组。 用户 1 没有用户 2 所缺少的东西。 这是子集关系，不是很好的匹配。 

该示例演示了为什么仅检查非空交叉点是不够的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(T\sqrt{T})$| 重光分解，$T=\sum k_i$|
 | 空间|$O(T)$| 活动清单和结对簿记|

 活动发生总数最多为$10^6$。 和$B \approx \sqrt T$，重度用户的数量和重度处理贡献的工作量仍然受$O(T\sqrt T)$。 这完全符合预期解决方案中的 3 秒限制。 

## 测试用例```python
import sys, io
from collections import defaultdict
from math import isqrt

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())

    sets = []
    total = 0
    activity_users = defaultdict(list)

    for idx in range(n):
        row = list(map(int, input().split()))
        k = row[0]
        arr = row[1:]
        sets.append(arr)
        total += k

        for x in arr:
            activity_users[x].append(idx)

    B = isqrt(max(total, 1)) + 1

    heavy = []
    is_heavy = [False] * n

    for i in range(n):
        if len(sets[i]) >= B:
            is_heavy[i] = True
            heavy.append(i)

    cnt = [0] * n

    for h in heavy:
        touched = []

        for act in sets[h]:
            for u in activity_users[act]:
                if cnt[u] == 0:
                    touched.append(u)
                cnt[u] += 1

        hs = len(sets[h])

        for u in touched:
            if u != h:
                c = cnt[u]
                if c > 0 and c < hs and c < len(sets[u]):
                    return "YES\n"

        for u in touched:
            cnt[u] = 0

    pair_cnt = defaultdict(int)

    for users in activity_users.values():
        light_users = [u for u in users if not is_heavy[u]]

        for i in range(len(light_users)):
            for j in range(i + 1, len(light_users)):
                a, b = sorted((light_users[i], light_users[j]))
                pair_cnt[(a, b)] += 1

    for (a, b), c in pair_cnt.items():
        if c < len(sets[a]) and c < len(sets[b]):
            return "YES\n"

    return "NO\n"

# provided sample
assert run(
"""3 5
3 1 2 4
5 1 2 3 4 5
2 1 5
"""
) == "YES\n"

# identical sets
assert run(
"""2 3
2 1 2
2 1 2
"""
) == "NO\n"

# disjoint sets
assert run(
"""2 3
1 1
1 2
"""
) == "NO\n"

# subset relation
assert run(
"""2 4
1 1
2 1 2
"""
) == "NO\n"

# minimal valid pair
assert run(
"""2 3
2 1 2
2 1 3
"""
) == "YES\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 相同套装 | 否 | 平等还不够|
 | 不相交集 | 否 | 需要共享活动 |
 | 子集关系| 否 | 两个用户都需要独特的活动 |
 | 最小有效对 | 是 | 最小的正例 |
 | 样品1 | 是 | 一般正确性 |

 ## 边缘情况

 考虑相同的配置文件：```
2 3
2 1 2
2 1 2
```交集大小为 2，等于两个集合的大小。 该算法拒绝该对，因为`c < len(set)`两个用户都失败。 输出是`NO`。 

考虑不相交的配置文件：```
2 3
1 1
1 2
```没有活动发生列表包含两个用户。 该对永远不会出现在繁重的处理或轻量的对计数中。 输出是`NO`。 

考虑一个严格子集：```
2 4
1 1
2 1 2
```交集大小为 1。它等于第一组的大小。 条件`c < len(first)`失败，因此该对被拒绝。 输出是`NO`。 

考虑一个有效的不可比较对：```
2 4
2 1 2
2 1 3
```交集大小为 1。两个集合大小均为 2，因此```
1 < 2
1 < 2
```成立。 每个用户都有一项独特的活动。 算法输出`YES`。 

这些案例涵盖了一对可能失败的三种方式以及成功的一种方式，完全符合良好匹配的定义。
