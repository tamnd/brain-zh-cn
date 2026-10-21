---
title: "CF 114B - PFAST 公司"
description: "我们得到了一小群人和一份不能一起工作的配对名单。 我们需要选择最大可能的子集，以便所选组内的每一对都是兼容的。 这自然是一个图问题。 将每个志愿者视为一个顶点。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "graphs"]
categories: ["algorithms"]
codeforces_contest: 114
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 86 (Div. 2 Only)"
rating: 1500
weight: 114
solve_time_s: 139
verified: true
draft: false
---

[CF 114B - PFAST Inc.](https://codeforces.com/problemset/problem/114/B)

 **评分：** 1500
 **标签：** 位掩码、暴力破解、图表
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一小群人和一份不能一起工作的配对名单。 我们需要选择最大可能的子集，以便所选组内的每一对都是兼容的。 

这自然是一个图问题。 将每个志愿者视为一个顶点。 如果两个人互相不喜欢对方，我们就会在他们之间添加优势。 任务变成找到任意两个顶点之间没有边的最大顶点子集。 在图论中，这称为最大独立集。 

志愿者的数量最多为16人，这完全改变了我们应该如何思考这个问题。 一般的最大独立集问题是 NP 困难的，但只有 16 个顶点，我们可以对所有子集进行详尽的搜索。 只有$2^{16} = 65536$子集，这对于现代硬件来说很小。 即使我们花费数百次操作来检查每个子集，总工作量也很容易满足时间限制。 

不进行修剪的简单递归回溯方法仍然会变得混乱，因为它会反复重新计算重叠状态之间的兼容性检查。 由于搜索空间已经足够小，因此直接迭代每个位掩码更加简单和安全。 

有几种边缘情况可能会悄无声息地破坏实现。 

一种常见的错误是将不相容关系视为有向关系而不是无向关系。 

输入：```
2 1
Alice
Bob
Alice Bob
```正确答案是任何一个人。 如果我们只标记`Alice -> Bob`但忘记了`Bob -> Alice`，那么子集`{Bob, Alice}`根据迭代顺序，可能会错误地显示为有效。 

另一个简单的错误是忘记名称区分大小写。 

输入：```
2 0
Petya
petya
```这些是不同的人。 正确答案包含两个名字。 将名称转换为小写会错误地合并它们。 

检查子集是否有效时会出现一个更微妙的问题。 假设我们只验证每个选定的节点至少有一个兼容的邻居。 这个条件毫无意义，因为兼容性必须适用于每一对。 

输入：```
3 2
A
B
C
A B
B C
```有效的最大团队是`{A, C}`大小为 2。粗心的本地检查可能会错误地允许所有三个。 

最后，输出必须按字典顺序排序。 内部索引顺序是任意的并且取决于输入顺序，因此直接从索引打印选定的名称可能会产生错误的格式。 

## 方法

 最直接的解决方案是对所有人群进行暴力破解。 

对于每个子集，我们测试所有选定的成员是否成对兼容。 如果是，我们将其大小与迄今为止找到的最佳答案进行比较。 

最简单的兼容性检查检查子集中的每一对。 和$n = 16$， 有$2^{16}$子集和至多$16^2$每个子集配对检查。 这大致给出：$$2^{16} \times 16^2 \approx 1.6 \times 10^7$$操作，这在Python中已经可以接受。 

蛮力之所以有效，是因为约束条件非常小。 问题不在于渐近不可行，而在于实现的清洁度和避免不必要的重复检查。 

关键的观察是子集自然地表示为位掩码。 每个人对应一位。 我们还可以为每个人存储与他们发生冲突的人的位掩码。 

现在验证子集变得非常快。 为了一个被选择的人`i`， 如果：$$mask \& bad[i] \neq 0$$那么该子集包含与以下内容不兼容的人`i`，所以子集无效。 

这将成对检查转换为紧凑的位操作。 

该问题结构使位掩码成为理想选择，因为：

 1.宇宙尺寸很小。 
2. 无论如何都必须考虑每个子集。 
3. 兼容性关系是静态的。 
4. 位运算速度极快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解与配对检查 |$O(2^n \cdot n^2)$|$O(n^2)$| 已接受 |
 | 位掩码优化 |$O(2^n \cdot n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 读取所有姓名并为每个人分配一个索引`0`到`n-1`。 

使用整数索引允许我们在计算过程中使用紧凑的位掩码而不是字符串。 
2. 构建从名称到索引的映射。 

这使我们能够有效地将不兼容对从字符串转换为数字顶点 ID。 
3. 创建数组`bad`在哪里`bad[i]`是与人不兼容的每个人的位掩码`i`。 

如果人`i`不喜欢的人`j`，然后设置位`j`里面`bad[i]`，并且还设置位`i`里面`bad[j]`。 
4. 迭代每个子集`mask`从`0`到`(1 << n) - 1`。 

每个位掩码代表一个可能的团队。 
5. 对于每个子集，检查它是否有效。 

遍历所有人`i`。 如果人`i`位于子集内并且：$$mask \& bad[i] \neq 0$$那么某个不兼容的队友也在该子集内，因此该子集无法使用。 
6. 如果子集有效，则将其大小与当前最佳答案进行比较。 

使用`mask.bit_count()`有效地计算团队规模。 
7. 存储找到的最佳子集。 

任何最大解都是可以接受的，因此平局并不重要。 
8. 提取属于最佳子集的名称。 

在打印之前按字典顺序对它们进行排序，因为问题需要排序输出。 

### 为什么它有效

 当子集内部没有不兼容的对同时出现时，该子集才是有效的。 

数组`bad[i]`包含了每一个与之发生冲突的人`i`。 在验证期间，表达式：$$mask \& bad[i]$$检查当前子集是否包含任何不兼容的伙伴`i`。 

如果此表达式对于某些选定的人来说不为零`i`，则该子集违反了要求，必须被拒绝。 

如果每个选定人员的表达式为零，则子集中不存在任何冲突对，因此子集有效。 

由于该算法会检查每个可能的子集，因此找到的最大有效子集保证是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    names = [input().strip() for _ in range(n)]

    idx = {}
    for i, name in enumerate(names):
        idx[name] = i

    bad = [0] * n

    for _ in range(m):
        a, b = input().split()

        u = idx[a]
        v = idx[b]

        bad[u] |= (1 << v)
        bad[v] |= (1 << u)

    best_mask = 0
    best_size = 0

    for mask in range(1 << n):
        ok = True

        for i in range(n):
            if (mask >> i) & 1:
                if mask & bad[i]:
                    ok = False
                    break

        if ok:
            size = mask.bit_count()

            if size > best_size:
                best_size = size
                best_mask = mask

    ans = []

    for i in range(n):
        if (best_mask >> i) & 1:
            ans.append(names[i])

    ans.sort()

    print(best_size)
    print(*ans, sep="\n")

solve()
```第一部分读取名称并将其转换为整数索引。 这很重要，因为位掩码操作只能与数字 ID 一起正常工作。 

这`bad`数组存储不兼容掩码。 如果`bad[3]`已设置位 1 和 5，则人员 3 不能与人员 1 和 5 一起工作。 

子集循环枚举每个可能的团队。 自从`n <= 16`，子集总数只有65536个。 

验证步骤是解决方案的核心。 对于每个选定的人`i`，我们测试子集中是否也存在任何被禁止的队友。 表达式：```
mask & bad[i]
```当至少有一个冲突的人存在时，返回一个非零整数。 

该实现独立检查所有选定的顶点。 尽管这可能会两次检测到相同的坏对，但常数因子很小并且逻辑仍然非常清晰。 

输出阶段收集选定的名称并按字典顺序对它们进行排序。 这个细节很容易被忘记，因为内部子集顺序遵循输入顺序，而不是字典顺序。 

## 工作示例

 ### 示例 1

 输入：```
3 1
Petya
Vasya
Masha
Petya Vasya
```索引分配：

 | 名称 | 索引 |
 | ---| ---|
 | 彼佳| 0 |
 | 瓦夏 | 1 |
 | 玛莎| 2 |

 冲突面具：

 | 人 | 坏面具| 意义|
 | ---| ---| ---|
 | 彼佳| 010| 与瓦夏的冲突|
 | 瓦夏 | 001| 与 Petya 的冲突 |
 | 玛莎| 000 | 000 与任何人发生冲突|

 子集跟踪：

 | 面膜| 会员 | 有效 | 尺寸|
 | ---| ---| ---| ---|
 | 000 | 000 {} | 是的 | 0 |
 | 001| {佩蒂亚} | 是的 | 1 |
 | 010| {瓦夏} | 是的 | 1 |
 | 011| {佩蒂亚，瓦夏} | 没有 | - |
 | 100 | 100 {玛莎} | 是的 | 1 |
 | 101 | 101 {佩蒂亚，玛莎}| 是的 | 2 |
 | 110 | 110 {瓦夏，玛莎} | 是的 | 2 |
 | 111 | 111 {佩蒂亚，瓦夏，玛莎} | 没有 | - |

 最大有效大小为 2。一个可接受的答案是`{Masha, Petya}`。 

此跟踪演示了一旦出现冲突对，无效子集如何立即被拒绝。 

### 示例 2

 输入：```
4 3
A
B
C
D
A B
B C
C D
```冲突面具：

 | 人 | 冲突|
 | ---| ---|
 | 一个 | 乙|
 | 乙| A、C |
 | C | 乙、丁 |
 | d | C |

 较大候选者的子集跟踪：

 | 面膜| 会员 | 有效 | 尺寸|
 | ---| ---| ---| ---|
 | 0011| {A，B} | 没有 | - |
 | 0101| {A，C}| 是的 | 2 |
 | 1001 | 1001 {A，D}| 是的 | 2 |
 | 1010 | 1010 {B，D}| 是的 | 2 |
 | 1100 | 1100 {C，D}| 没有 | - |
 | 1111 | 1111 {A，B，C，D}| 没有 | - |

 不存在大小为 3 的有效子集，因此答案大小为 2。 

这个例子表明不兼容纯粹是成对的。 虽然`A`和`D`即使通过其他人间接联系，他们仍然可以属于同一个团队。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(2^n \cdot n)$| 每个子集都会针对所有人进行检查 |
 | 空间|$O(n)$| 我们为每人储存一个冲突面具 |

 和$n \le 16$，算法大致执行：$$65536 \times 16 \approx 10^6$$基本迭代，完全在限制范围内。 内存使用量可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n, m = map(int, input().split())

        names = [input().strip() for _ in range(n)]

        idx = {}
        for i, name in enumerate(names):
            idx[name] = i

        bad = [0] * n

        for _ in range(m):
            a, b = input().split()

            u = idx[a]
            v = idx[b]

            bad[u] |= (1 << v)
            bad[v] |= (1 << u)

        best_mask = 0
        best_size = 0

        for mask in range(1 << n):
            ok = True

            for i in range(n):
                if (mask >> i) & 1:
                    if mask & bad[i]:
                        ok = False
                        break

            if ok:
                size = mask.bit_count()

                if size > best_size:
                    best_size = size
                    best_mask = mask

        ans = []

        for i in range(n):
            if (best_mask >> i) & 1:
                ans.append(names[i])

        ans.sort()

        out = [str(best_size)]
        out.extend(ans)

        return "\n".join(out)

    return solve()

# provided sample
assert run(
"""3 1
Petya
Vasya
Masha
Petya Vasya
"""
) == "2\nMasha\nPetya"

# minimum size
assert run(
"""1 0
Solo
"""
) == "1\nSolo"

# everyone compatible
assert run(
"""3 0
A
B
C
"""
) == "3\nA\nB\nC"

# complete conflict graph
out = run(
"""4 6
A
B
C
D
A B
A C
A D
B C
B D
C D
"""
)

assert out in {
    "1\nA",
    "1\nB",
    "1\nC",
    "1\nD"
}

# case-sensitive names
assert run(
"""2 0
Petya
petya
"""
) == "2\nPetya\npetya"

# chain conflicts
out = run(
"""4 3
A
B
C
D
A B
B C
C D
"""
)

assert out in {
    "2\nA\nC",
    "2\nA\nD",
    "2\nB\nD"
}
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单身人士| 团队规模 1 | 最小约束处理|
 | 没有冲突| 大家都选了 | 完整子集选择 |
 | 完整图表| 只有一个人 | 冲突检查正确性 |
 |`Petya`与`petya`| 都选择了 | 区分大小写的名称 |
 | 连锁冲突| 最大独立集| 不平凡的图结构 |

 ## 边缘情况

 考虑一下按照指示错误地处理不兼容性的情况。 

输入：```
2 1
Alice
Bob
Alice Bob
```该算法存储：```
bad[Alice] |= Bob
bad[Bob] |= Alice
```现在检查子集时`{Alice, Bob}`，两个人都检测到冲突，因此子集被正确拒绝。 

考虑区分大小写的名称。 

输入：```
2 0
Petya
petya
```映射字典存储两个单独的键：```
{
    "Petya": 0,
    "petya": 1
}
```由于不存在冲突，子集`11`有效并且两个名字都出现在答案中。 

考虑一个间接连接不重要的图表。 

输入：```
3 2
A
B
C
A B
B C
```子集`{A, C}`对应掩码`101`。 

为了`A`:```
mask & bad[A] = 101 & 010 = 0
```为了`C`:```
mask & bad[C] = 101 & 010 = 0
```该子集是有效的，因为只有直接的不兼容性才重要。 

最后，考虑完全断开的图。 

输入：```
4 0
A
B
C
D
```全部`bad[i]`面具为零。 每个子集都通过验证，算法最终选择掩模`1111`，包含所有四个人。
