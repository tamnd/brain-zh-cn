---
title: "CF 104761C - \u0414\u0435\u043b\u0438\u043c\u043e\u0441\u0442\u044c \u043d\u0430 2023"
description: "我们有两个不同的数字，称之为 $A$ 和 $B$，每个数字都在 0 到 9 之间。只要我们不使用任何其他数字，我们就可以仅通过这两个数字以任何顺序和任何长度连接它们来构造任何正整数。"
date: "2026-06-29T02:23:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104761
codeforces_index: "C"
codeforces_contest_name: "2023-2024 ICPC NERC (NEERC), Kyrgyzstan Regional Contest"
rating: 0
weight: 104761
solve_time_s: 66
verified: false
draft: false
---

[CF 104761C - \u0414\u0435\u043b\u0438\u043c\u043e\u0441\u0442\u044c \u043d\u0430 2023](https://codeforces.com/problemset/problem/104761/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个不同的数字，称它们为$A$和$B$，每个都在 0 到 9 之间。仅从这两个数字中，我们可以通过以任何顺序和任何长度连接它们来构造任何正整数，只要我们不使用任何其他数字。 任务是输出任何能被 2023 整除的数字，并且它还必须满足最多 100 位数字的大小限制，并且不能从零开始。 

核心困难不是从数字中构建数字，而是在非常大的搜索空间下找到满足特定整除条件的数字。 即使我们固定一个长度，也有$2^n$可能的字符串，因此除了非常小的长度之外，对所有字符串进行暴力破解是不可能的。 

重要的结构约束是目标模数是固定的且很小：2023。这立即表明我们应该考虑以 2023 为模的余数，因为任何长于 2023+1 位的数字最终都必须重复余数模式。 

一个很容易误导实现的简单边缘情况是当其中一个数字为 0 时。例如，如果$A = 0$和$B = 7$，粗心的构造可能会尝试以 0 开头，产生无效的前导零，例如 0077...，即使数字有效，也是不允许的。 另一种微妙的情况是当一个数字为 0 而另一个数字较小时； 即使存在有效的混合模式，像重复非零数字这样的贪婪结构也可能无法达到 2023 的倍数。 

## 方法

 一个蛮力的想法是生成字母表上的所有字符串$\{A, B\}$增加长度并测试每个字符串是否能被 2023 整除。对于每个生成的字符串，我们计算其对 2023 求模的值并检查它是否为零。 这是正确的，因为它耗尽了所有候选人的精力。 

然而，候选者的数量随着长度呈指数增长。 对于长度 50，我们已经有$2^{50}$可能性，这远远超出了任何可行的计算。 如果我们仍然枚举所有字符串，那么即使增量计算模数也无济于事。 

关键的观察是，我们不关心实际数字，只关心它对 2023 求模后的余数。每次追加一个数字时，新的余数仅取决于之前的余数和追加的数字。 这将问题转化为状态图问题$0 \ldots 2022$，其中每个状态代表一个余数，并且转换对应于附加任一数字$A$或数字$B$。 

这给出了一个最多有 2023 个节点的有向图，每个节点都有两个出边。 我们希望找到从有效初始数字（非零前导数字）开始到达余数 0 的任何路径。由于图是有限的，BFS 保证我们要么找到解决方案，要么耗尽所有状态。 因为保证在预期的构造空间中存在解，所以 BFS 将有效地找到一个解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n)$|$O(n)$| 太慢了 |
 | 余数上的 BFS |$O(2023)$|$O(2023)$| 已接受 |

 ## 算法演练

 我们将每个状态建模为一对，由模 2023 的余数和到目前为止构建的字符串组成。 我们不是存储每个状态的完整字符串，而是存储父指针以在最后重建答案。 

1. 我们用所有有效的起始数字初始化一个 BFS 队列。 如果数字为零，则不能用作第一个字符，因此我们只能从非零数字开始。 每个起始数字贡献的初始余数等于该数字模 2023。这确保我们永远不会产生无效的前导零。 
2.对于队列中的每个状态，我们考虑附加数字$A$和数字$B$。 如果当前的余数是$r$，然后是附加数字后的新余数$d$是$(10r + d) \bmod 2023$。 这个递归准确地捕捉了十进制数字是如何增长的。 
3. 如果我们在任何时候达到余数 0，我们立即停止。 从起始状态到此状态的路径定义了一个可被 2023 整除的有效数字。 
4. 为了重建数字，我们从零状态向后跟踪存储的父指针，直到到达开头。 然后我们反转数字的顺序。 
5. 我们输出重构后的字符串。 

关键的设计选择是仅存储前辈而不是完整的字符串，这可以保持内存有限并允许有效的重建。 

### 为什么它有效

 每个 BFS 状态恰好代表具有特定数字序列的一个可达余数。 每个扩展步骤都保留了余数计算的正确性，因为十进制串联是通过以下方式忠实建模的$10r + d$。 BFS 以递增的位数探索状态，因此我们第一次达到余数 0 时对应于有效的构造。 由于只有 2023 个可能的余数，如果在允许的数字字母表中存在解，BFS 将遇到它，而无需显式探索指数长度的字符串。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

MOD = 2023

def solve():
    A, B = map(int, input().split())
    digits = [A, B]

    # store visited remainders
    prev = [-1] * MOD
    prev_digit = [-1] * MOD
    visited = [False] * MOD

    q = deque()

    # initialize with valid starting digits (no leading zero)
    for d in digits:
        if d == 0:
            continue
        r = d % MOD
        if not visited[r]:
            visited[r] = True
            prev[r] = -2  # start marker
            prev_digit[r] = d
            q.append(r)

    # BFS over remainder states
    while q:
        r = q.popleft()

        if r == 0:
            break

        for d in digits:
            nr = (r * 10 + d) % MOD
            if not visited[nr]:
                visited[nr] = True
                prev[nr] = r
                prev_digit[nr] = d
                q.append(nr)

    if not visited[0]:
        return ""

    # reconstruct answer
    res = []
    cur = 0
    while prev[cur] != -2:
        res.append(str(prev_digit[cur]))
        cur = prev[cur]

    res.append(str(prev_digit[cur]))
    return "".join(reversed(res))

if __name__ == "__main__":
    print(solve())
```BFS 纯粹基于余数实现，这使得状态空间较小。 数组`prev`和`prev_digit`允许重建而不存储完整的字符串。 标记`-2`区分根状态和中间状态。 

一个微妙的实现点是 initi
