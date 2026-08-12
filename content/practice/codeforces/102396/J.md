---
title: "CF 102396J - 超级排列"
description: "构造从序列 [1] 开始。 为了从 m 阶移动到 m+1 阶，我们扫描当前序列的每个长度为 m 的窗口。 每当这样的窗口是 1..m 的排列时，我们就插入新值 m+1，然后紧接着窗口后面插入相同的排列。"
date: "2026-08-10T18:55:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102396
codeforces_index: "J"
codeforces_contest_name: "2019-2020 Saint-Petersburg Open High School Programming Contest (SpbKOSHP 19)"
rating: 0
weight: 102396
solve_time_s: 448
verified: true
draft: false
---

[CF 102396J - 超级排列](https://codeforces.com/problemset/problem/102396/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 施工从顺序开始`[1]`。 从顺序移动`m`订购`m+1`，我们扫描每个长度-`m`当前序列的窗口。 每当这样的窗口是一个排列`1..m`，我们插入新值`m+1`紧接着窗口之后是相同的排列。 

结果序列包含每个排列一次作为长度-`m`窗户。 任务不是构建这个巨大的序列。 相反，对于给定的排列`a`的`1..n`，我们需要其唯一出现开始的 1 索引位置，模`10^9+7`。 官方声明给出了相同的递归构造和相同的界限，包括`n <= 300000`。 

约束条件`n <= 300000`排除任何显式构造超排列或枚举其排列的内容。 它的长度是

 [
 |s_n|=1!+2!+\cdots+n!,
 ]

 所以即使存储`s_n`是不可能的。 解决方案必须以大致线性或线性的方式处理给定的排列`O(n log n)`时间和使用`O(n)`记忆。 一秒的限制使得`O(n log n)`实施值得保持严格，而任何涉及`n!`工作完全遥不可及。 

有几种边缘情况暴露了常见错误。 为了`n=1`，唯一的输入是`[1]`，答案是`1`。 假设先前的非空排列的递归在这里将失败。 为了`n=2`，排列`[2,1]`从位置开始`2`在`s_2=[1,2,1]`， 尽管`[1,2]`从位置开始`1`。 这捕获了最大元素贡献中的相差一误差。 当最大值位于末尾时，例如`[2,3,1,4]`，它的插入发生在底层排列之后，但目标本身可以在该插入之前开始。 将每次出现视为从插入的位置开始`4`给出了错误的答案`9`而不是`6`。 最后，输入保证值形成排列，因此全相等的输入，例如`3 / 1 1 1`不是有效的测试用例，不得用于测试提交的解决方案。 

## 方法

 直接的解决方案是构建序列`s_1,s_2,...,s_n`。 在阶段`m`，我们必须检查每个长度-`m`窗口并确定它是否包含来自的每个值`1`通过`m`。 已经有`Theta(m!)`在该阶段的位置，天真地检查一个窗口需要`Theta(m)`时间。 仅最后阶段的成本`Theta(n * n!)`在最坏的情况下操作，除了要求`Theta(n!)`内存只是用来存储序列的。 和`n=300000`，这不太可行。 

蛮力之所以有效，是因为每次插入都是本地的。 如果一个排列`q`尺寸的`m-1`发生在`s_{m-1}`, 建筑嵌件`[m,q]`紧随其后。 这恰好创建了`m`连续尺寸-`m`围绕该插入的排列。 有用的观察是，这些`m`排列只是循环旋转`q`和`m`插入不同的位置。 

假设当前排列是`p`，和最大值`m`发生在位置`k`。 消除`m`并旋转剩余的序列，以便紧随其后的元素`m`成为第一个元素。 调用结果排列`q`。 然后`q`正是尺寸-`m-1`其插入创建的排列`p`。 

我们还需要另一个数量。 让`R_m(p)`是从零开始的排名`p`其中`m!`排列按照它们出现的顺序`s_m`。 如果`q`有等级`R_{m-1}(q)`，其所有的`m`导出的排列形成一个连续的组。 的位置`p`这个组里面是`m-k`， 因为`m`处于位置`k`。 因此

 [
 R_m(p)=mR_{m-1}(q)+(m-k)。 
]

 实际位置有一个更简单的递归。 组前为`q`，每个较早的大小排列`m-1`导致插入`m`元素，所以`q`被移动了`mR_{m-1}(q)`职位。 目标开始`m-k`相对于开始的位置较晚`q`。 因此

 [
 P_m(p)=P_{m-1}(q)+R_m(p)。 
]

 开始于`P_1=1`，最终的答案是

 [
 P_n=1+\sum_{m=2}^{n}R_m。 
]

 剩下的挑战是获得每个值`m-k`无需在每个级别显式旋转排列。 

旋转对圆有清晰的解释。 从原始排列开始作为循环列表。 当处理最大`m`，所有较大的值都已被删除，并且当前的线性排列在先前删除的最大值之后立即开始。 去除`m`意味着下一个幸存元素成为新的开始。 所以`m-k`正是之后当前存活位置的数量`m`在当前启动之前，循环测量。 

芬威克树维护哪些原始位置仍然有效。 当一个位置被删除时，双向链表会保留当前的循环后继。 他们一起让我们计算每一个`m-k`在`O(log n)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`Theta(n * n!)`|`Theta(n!)`| 太慢了|
 | 最佳 |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 商店`pos[x]`，每个值的原始数组位置`x`。 这些值是唯一的，因此这可以恒定时间访问当前最大值的位置。 
2. 将原始数组位置视为循环双向链表。 最初每个位置都是活的，`next[i]`指向下一个位置，并且`prev[i]`指向前一个位置。 当前的线性表示从位置开始`1`。 
3. 初始化 Fenwick 树`1`在每个位置。 Fenwick 前缀和现在告诉我们有多少当前活动的元素出现在给定的原始位置。 
4. 流程`m=n,n-1,...,2`。 让`x=pos[m]`。 目前的排列`1..m`开始于`start`并遵循活动位置的循环顺序，直到到达`x`。 
5.让`d_m=m-k`， 在哪里`k`是 1 索引位置`m`在当前的排列中。 如果`start <= x`，那么后面的元素`x`在包装到之前`start`被计算为`m - prefix(x)`。 如果`start > x`，相关区间为普通区间`(x,start)`，其存活位置数为`prefix(start-1)-prefix(x)`。 这给出了`d_m`无需构造旋转排列。 
6. 删除`x`来自 Fenwick 树和链表。 新的`start`变成`next[x]`，因为去除`m`旋转剩余的排列，使得后继者`m`是第一。 
7. 毕竟`d_m`值已计算，处理`m=2,3,...,n`。 维持`rank`，最初为零。 复发

 [
 等级=m\cdot 等级+d_m
 ]

 计算`R_m`从`R_{m-1}`。 将此排名添加到答案中，因为`P_m=P_{m-1}+R_m`。 

1. 开始回答`1`，对应于尺寸一的唯一排列。 执行每个乘法和加法模`10^9+7`。 

### 为什么它有效

 各种尺寸`m`，从目标排列中删除最大值并在其精确产生排列后进行旋转`q`其插入生成了目标。 施工过程中尺寸的出现`m-1`从左到右，每次出现这样的情况都会生成一组连续的`m`尺寸-`m`排列。 在该组内，在位置处具有最大值的排列`k`是`(m-k)`第 - 个成员，所以`R_m=mR_{m-1}+(m-k)`。 较早的小组将相应的事件精确移动`m`每个位置，给予`P_m=P_{m-1}+R_m`。 循环链表准确地表示通过重复删除当前最大值并紧随其后开始而获得的序列，而芬威克树则计算其幸存元素。 因此每一个`d_m=m-k`递归使用的是精确的，最终累加的位置就是需要出现的位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    pos = [0] * (n + 1)
    for i, x in enumerate(a, 1):
        pos[x] = i

    # Fenwick tree containing 1 for every currently alive position.
    bit = [0] * (n + 1)

    # Build the Fenwick tree in O(n).
    for i in range(1, n + 1):
        bit[i] += 1
        j = i + (i & -i)
        if j <= n:
            bit[j] += bit[i]

    def prefix(x):
        s = 0
        while x:
            s += bit[x]
            x -= x & -x
        return s

    def remove(x):
        while x <= n:
            bit[x] -= 1
            x += x & -x

    # Circular doubly linked list of alive positions.
    nxt = [0] * (n + 1)
    prv = [0] * (n + 1)

    for i in range(1, n + 1):
        nxt[i] = i + 1 if i < n else 1
        prv[i] = i - 1 if i > 1 else n

    # d[m] = m - position_of_m_in_the_current_permutation.
    d = [0] * (n + 1)

    start = 1

    for m in range(n, 1, -1):
        x = pos[m]

        px = prefix(x)

        if start <= x:
            d[m] = m - px
        else:
            d[m] = prefix(start - 1) - px

        # Remove x and rotate the remaining circular order so
        # that its successor becomes the new first position.
        nx = nxt[x]
        p = prv[x]

        nxt[p] = nx
        prv[nx] = p
        start = nx

        remove(x)

    rank = 0
    answer = 1

    for m in range(2, n + 1):
        rank = (m * rank + d[m]) % MOD
        answer += rank
        if answer >= MOD:
            answer -= MOD

    print(answer)

if __name__ == "__main__":
    solve()
```这`pos`array 让下降阶段在常数时间内找到当前最大值。 芬威克树对于每个尚未被移除的值都包含一个单元，因此它的前缀和代表原始排列的一个区间中幸存元素的数量。 

需要链表的原因不同。 当前排列不是原始数组，从左侧或右侧删除了一些条目。 这是一种圆周旋转，其起点在删除每个最大值后发生变化。`start`记录旋转，以及`nxt`和`prv`删除后在恒定时间内更新它。 

表达式为`d[m]`故意用当前大小来写`m`。 移除前`m`， 确切地`m`职位还活着。 什么时候`start <= x`, 之后的元素`x`包装之前只是之后的所有活动元素`x`，即`m-prefix(x)`。 什么时候`start > x`，相关区间不回绕，因此需要两个前缀和的差值。 

第二遍从最小尺寸到最大尺寸重建排名。`rank`商店`R_{m-1}`更新之前变成`R_m`乘以后`m`并添加`d[m]`。 答案从`P_1=1`，然后恰好收到一份贡献`R_m`在每个级别。 

Python 整数不会溢出，但每次循环后取模可以保持较小的值并避免不必要的大整数算术。 Fenwick 树本身仅存储最多可达`n`，因此它的条目永远不会变大。 

## 工作示例

 ### 示例 1

 输入排列是`[2,3,1]`。 其立场是`pos[1]=3`,`pos[2]=1`， 和`pos[3]=2`。 

|`m`|`start`|`pos[m]`| 活动前缀位于`pos[m]`|`d[m]`| 新的`start`|
 | ---| ---| ---| ---| ---| ---|
 | 3 | 1 | 2 | 2 | 1 | 3 |
 | 2 | 3 | 1 | 1 | 0 | 2 |

 为了`m=3`，当前的排列是`[2,3,1]`， 所以`3`处于位置`2`和`d_3=3-2=1`。 移除后`3`，剩余循环顺序为`[1,2]`从位置开始`3`。 
排名计算为
 [
 R_2=0，
 \四边形
 R_3=3\cdot 0+1=1。 
]
 位置是
 [
 P_3=1+R_2+R_3=1+0+1=2。 
]
 因此答案是`2`，匹配样本。 

### 示例 2

 排列是`[2,3,1,4]`，有位置`pos[1]=3`,`pos[2]=1`,`pos[3]=2`， 和`pos[4]=4`。 

|`m`|`start`|`pos[m]`|`d[m]`| 新的`start`|`R_m`| 之后回答`R_m`|
 | ---| ---| ---| ---| ---| ---| ---|
 | 4 | 1 | 4 | 0 | 1 | 0 | 1 |
 | 3 | 1 | 2 | 1 | 3 | 1 | 2 |
 | 2 | 3 | 1 | 0 | 2 | 2 | 4 |

 最终的排名值为`R_2=0`,`R_3=1`， 和`R_4=4`。 因此

 [
 P_4=1+0+1+4=6。 
]

 这个例子说明了为什么排名贡献很重要。 排列`[2,3,1]`不停留在岗位上`2`搬家后`s_3`到`s_4`，因为较早的置换群在其前面插入了四个新元素。 它的移位出现是目标的前缀`[2,3,1,4]`，从位置开始`6`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n log n)`| 每个`n`职位被删除一次，Fenwick 更新和前缀查询将被删除`O(log n)`。 排名传递是线性的。 |
 | 空间|`O(n)`| 位置数组、Fenwick 树、链表数组和`d`数组都有大小`O(n)`。 |

 为了`n=300000`，该算法从不构造超排列，也从不枚举其`n!`排列。 这`O(n log n)`数据结构工作和线性辅助存储器符合约束的预期规模，而对于与最大输入相比非常小的值，显式构造已经是不可能的。 

## 测试用例```python
import sys
import io

MOD = 1_000_000_007

def solution(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    n = int(sys.stdin.readline())
    a = list(map(int, sys.stdin.readline().split()))

    pos = [0] * (n + 1)
    for i, x in enumerate(a, 1):
        pos[x] = i

    bit = [0] * (n + 1)

    for i in range(1, n + 1):
        bit[i] += 1
        j = i + (i & -i)
        if j <= n:
            bit[j] += bit[i]

    def prefix(x):
        s = 0
        while x:
            s += bit[x]
            x -= x & -x
        return s

    def remove(x):
        while x <= n:
            bit[x] -= 1
            x += x & -x

    nxt = [0] * (n + 1)
    prv = [0] * (n + 1)

    for i in range(1, n + 1):
        nxt[i] = i + 1 if i < n else 1
        prv[i] = i - 1 if i > 1 else n

    d = [0] * (n + 1)
    start = 1

    for m in range(n, 1, -1):
        x = pos[m]
        px = prefix(x)

        if start <= x:
            d[m] = m - px
        else:
            d[m] = prefix(start - 1) - px

        nx = nxt[x]
        p = prv[x]

        nxt[p] = nx
        prv[nx] = p
        start = nx

        remove(x)

    rank = 0
    answer = 1

    for m in range(2, n + 1):
        rank = (m * rank + d[m]) % MOD
        answer += rank
        if answer >= MOD:
            answer -= MOD

    sys.stdin = old_stdin
    return str(answer)

# Provided samples
assert solution("3\n2 3 1\n") == "2", "sample 1"
assert solution("4\n2 3 1 4\n") == "6", "sample 2"
assert solution("4\n4 3 1 2\n") == "14", "sample 3"

# Minimum size
assert solution("1\n1\n") == "1", "minimum size"

# Maximum at the first position
assert solution("3\n3 1 2\n") == "3", "maximum at first"

# Maximum at the last position
assert solution("2\n1 2\n") == "1", "maximum at last, identity"

assert solution("2\n2 1\n") == "2", "maximum at first for n=2"

# A larger custom case exercising several circular rotations
assert solution("5\n5 1 4 2 3\n") == "17", "circular rotation case"

# Maximum-size valid input.
# The identity permutation has answer 1 for every n.
n = 300000
identity = " ".join(map(str, range(1, n + 1)))
assert solution(f"{n}\n{identity}\n") == "1", "maximum n"

# An all-equal input is deliberately not tested because the problem
# guarantees that the second line is a permutation, so duplicates are invalid.
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1`|`1`| 最小尺寸边界和基本情况 |
 |`3 / 3 1 2`|`3`| 第一个位置的最大值 |
 |`2 / 1 2`|`1`| 最后位置的最大值和零排名贡献 |
 |`2 / 2 1`|`2`| 最小的非平凡插入偏移 |
 |`5 / 5 1 4 2 3`|`17`| 多次循环旋转和非零等级 |
 |`300000 / 1 2 ... 300000`|`1`| 最大输入大小和线性内存行为 |

 ## 边缘情况

 对于`n=1`，输入正好是`[1]`。 不存在最大移除循环，因为循环开始于`m=2`。 排名保持为零，答案保持其初始值`1`，这正是`[1]`在`s_1`。 

为了`n=2`和排列`[2,1]`,当前开始位置`1`和最大`2`也处于位置`1`。 芬威克树在位置后报告一个幸存元素`1`， 所以`d_2=1`。 排名变为`R_2=1`，答案就变成了`1+1=2`。 这匹配`s_2=[1,2,1]`。 

对于第一个位置的最大值，考虑`[3,1,2]`。 最大`3`有`k=1`， 所以`d_3=2`。 删除后，剩余订单从`1`。 尺寸为 2 时，最大`2`是在最后，给予`d_2=0`。 因此`R_2=0`,`R_3=2`，答案是`1+0+2=3`。 的确，`[3,1,2]`从位置开始`3`在`s_3`。 

对于最后位置的最大值，`[2,3,1,4]`有`d_4=0`，因为`4`发生在位置`4`。 下一个级别有`d_3=1`，这给出了`R_3=1`进而`R_4=4`。 最终的位置是`1+0+1+4=6`。 目标从位置开始`6`，在插入之前`4`，因此总是寻找最大值本身位置的算法是不正确的。 

对于圆形环绕，`[4,3,1,2]`特别有用。 最大`4`最初处于位置`1`， 所以`d_4=3`。 删除它使位置`2`新的开始。 下一个最大值`3`也处于新的第一位置，给予`d_3=2`。 最后`d_2=0`。 排名是`R_2=0`,`R_3=2`， 和`R_4=11`，所以答案是`1+0+2+11=14`。 链表使这种环绕行为变得明确，而不是强迫我们物理地旋转排列。 

完全相等的输入，例如`[1,1,1]`会违反输入保证，每个值来自`1`通过`n`恰好发生一次。 该算法在构造时依赖于这种保证`pos`，当解释当前最大值时，以及当每个值恰好删除一个位置时。 因此，它是一个无效的问题实例，而不是所需解决方案的边缘情况。
