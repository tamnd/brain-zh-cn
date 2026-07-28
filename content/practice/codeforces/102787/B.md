---
title: "CF 102787B - 梨树"
description: "我们维护一个可变字符串。 该字符串以n个小写字母开头，然后q个操作对其进行修改或提出有关它的问题。 删除会删除整个连续间隔。"
date: "2026-07-27T19:14:11+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102787
codeforces_index: "B"
codeforces_contest_name: "Algorithms Thread Treaps Contest"
rating: 0
weight: 102787
solve_time_s: 84
verified: true
draft: false
---

[CF 102787B - Pear TreaP](https://codeforces.com/problemset/problem/102787/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个可变字符串。 该字符串开头为`n`小写字母，然后`q`操作人员对其进行修改或提出相关问题。 删除会删除整个连续间隔。 插入将一个新字符放置在给定位置，并将后续字符向右移动。 查询询问当前子字符串是否等于其反向子字符串。 

困难在于位置不固定。 由于删除和插入，现在位于位置 100 的字符稍后可能位于位置 20。 同时，直接检查回文需要查看查询区间中的每个字符。 

限制很大：初始长度和操作次数都可以达到`3 * 10^5`。 扫描长度子串的解决方案`n`对于每个查询都可以执行`n * q`，这大约是`9 * 10^10`最坏情况下的字符检查。 即使每次操作的简单线性解决方案也远远超出了比赛时间限制所允许的范围。 我们需要每个操作都以对数时间进行。 

有几个容易被忽视的案例。 单字符子串始终是回文。 例如，输入```
1 1
z
3 1 1
```必须输出```
yes
```比较两半并忘记这种情况的解决方案可能会意外地拒绝它。 

另一种情况是插入发生在开头或结尾。 例如，```
3 2
abc
2 a 1
3 1 2
```产生字符串`aabc`，查询的子串为`aa`，所以答案是`yes`。 错误地将位置视为从零开始的代码通常会插入到错误的位置。 

删除还可以清空字符串的大部分。 例如，```
5 2
abcba
1 2 4
3 1 2
```树叶`aa`，这是一个回文。 删除后保留陈旧索引的结构可能会返回旧字符串的结果。 

## 方法

 一种直接的方法是将字符串存储在数组或列表中。 插入和删除需要移位字符，回文查询可以比较两端的字符。 查询本身的成本`O(length of substring)`，而插入和删除可能会花费`O(n)`因为很多角色可能会移动。 和`3 * 10^5`操作，最坏的情况大约达到`O(nq)`工作，这太慢了。 

关键的观察是这些操作都是基于序列内的位置。 我们不需要随机访问每个元素，我们需要在位置上分割序列，将片段连接在一起，并快速询问有关片段的信息。 

隐式trap正是为此而设计的。 它将序列存储为随机平衡二叉树，其中中序遍历是当前字符串顺序。 每个节点都存储其子树的大小，因此我们可以在某个位置进行分割并合并片段`O(log n)`预计时间。 

为了回答回文查询，每个treap节点维护两个滚动哈希：一个用于正常顺序的字符串，一个用于相反顺序的字符串。 如果子字符串具有相同的前向和后向哈希，则将其视为回文。 拆分trap会隔离所请求的子字符串，从而允许存储的哈希值在不扫描字符的情况下回答查询。 

暴力方法之所以有效，是因为它直接检查回文的定义，但它会重复重新计算信息。 子字符串可以由维护的散列表示的观察结果让我们可以在对数分割后用恒定时间检查来替换重复扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n)`每个查询，`O(n)`每次修改|`O(n)`| 太慢了|
 | 最佳|`O(log n)`预计每次操作 |`O(n)`| 已接受 |

 ## 算法演练

 1. 从初始字符串构建隐式陷阱。 每个节点存储其字符、子树大小、优先级、左右子节点以及两个哈希值。 正向哈希表示从左到右出现的子字符串，而反向哈希表示从右到左出现的相同子字符串。 
2. 删除仓位`l`通过`r`，将trap分成三部分：前面的前缀`l`，被删除的段，以及后面的后缀`r`。 中间部分被丢弃，剩下的两部分被合并。 
3. 用于插入位置`p`，将陷阱分成第一个`p-1`字符和其余后缀。 为插入的角色创建一个新节点并将三个部分重新合并在一起。 
4. 对于位置的回文查询`l`通过`r`，拆分出请求的段。 比较其正向哈希和反向哈希。 相等的哈希值意味着该段在两个方向上读取相同的内容。 然后将这些片段合并回去，以便恢复原始字符串。 
5. 在每次合并或拆分期间，重新计算存储的大小和哈希值。 这使每个节点的摘要等于其子树的确切信息。 

该算法背后的不变性是每个trap节点总是准确地描述其子树中包含的序列。 分割保留字符的顺序，并且仅合并连接已经正确的序列。 由于存储的哈希值在每次结构更改后都会更新，因此查询中使用的隔离段始终具有正确的正向和反向表示。 根据维护的哈希，相等表示证明该段是回文。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD1 = 10**9 + 7
MOD2 = 10**9 + 9
BASE = 911382323

MAXN = 700000

pow1 = [1] * (MAXN + 5)
pow2 = [1] * (MAXN + 5)
for i in range(1, MAXN + 5):
    pow1[i] = pow1[i - 1] * BASE % MOD1
    pow2[i] = pow2[i - 1] * BASE % MOD2

import random
random.seed(1)

class Node:
    __slots__ = ("c", "p", "l", "r", "sz", "h1", "h2", "rh1", "rh2")
    def __init__(self, c):
        self.c = ord(c) - 96
        self.p = random.randint(1, 1 << 60)
        self.l = None
        self.r = None
        self.sz = 1
        self.h1 = self.h2 = self.c
        self.rh1 = self.rh2 = self.c

def size(t):
    return t.sz if t else 0

def hashes(t):
    if t:
        return t.h1, t.h2, t.rh1, t.rh2
    return 0, 0, 0, 0

def pull(t):
    if not t:
        return
    ls = size(t.l)
    rs = size(t.r)
    lh1, lh2, lrh1, lrh2 = hashes(t.l)
    rh1, rh2, rrh1, rrh2 = hashes(t.r)

    t.sz = ls + 1 + rs

    t.h1 = (lh1 * pow1[1 + rs] + t.c * pow1[rs] + rh1) % MOD1
    t.h2 = (lh2 * pow2[1 + rs] + t.c * pow2[rs] + rh2) % MOD2

    t.rh1 = (rrh1 * pow1[1 + ls] + t.c * pow1[ls] + lrh1) % MOD1
    t.rh2 = (rrh2 * pow2[1 + ls] + t.c * pow2[ls] + lrh2) % MOD2

def split(t, k):
    if not t:
        return None, None
    if size(t.l) >= k:
        a, b = split(t.l, k)
        t.l = b
        pull(t)
        return a, t
    else:
        a, b = split(t.r, k - size(t.l) - 1)
        t.r = a
        pull(t)
        return t, b

def merge(a, b):
    if not a or not b:
        return a or b
    if a.p > b.p:
        a.r = merge(a.r, b)
        pull(a)
        return a
    else:
        b.l = merge(a, b.l)
        pull(b)
        return b

def build(s):
    root = None
    for ch in s:
        root = merge(root, Node(ch))
    return root

def solve():
    n, q = map(int, input().split())
    root = build(input().strip())
    ans = []

    for _ in range(q):
        query = input().split()
        typ = int(query[0])

        if typ == 1:
            l, r = int(query[1]), int(query[2])
            a, b = split(root, l - 1)
            _, c = split(b, r - l + 1)
            root = merge(a, c)

        elif typ == 2:
            c = query[1]
            p = int(query[2])
            a, b = split(root, p - 1)
            root = merge(merge(a, Node(c)), b)

        else:
            l, r = int(query[1]), int(query[2])
            a, b = split(root, l - 1)
            mid, c = split(b, r - l + 1)
            if mid.h1 == mid.rh1 and mid.h2 == mid.rh2:
                ans.append("yes")
            else:
                ans.append("no")
            root = merge(a, merge(mid, c))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```节点类准确地包含了trap 所需的信息。 子树大小允许`split`在不存储显式索引的情况下查找位置。 这四个哈希是两种不同模数下的正向和反向滚动哈希，减少了碰撞的机会。 

这`pull`功能是核心维护操作。 子级更改后，它会重新计算整个子树摘要。 这些公式将左子元素放在当前字符之前，然后将前向哈希放在右子元素之前。 反向哈希在相反的方向应用相同的想法。 

这`split`函数使用子树大小来分隔第一个`k`其余的字符。 重要的边界条件是`k`表示字符数，因此插入位置`p`意味着分裂在`p - 1`。 

查询操作暂时删除请求的间隔。 这不会复制字符，它只会更改树链接，因此它保持对数。 检查哈希值后，通过合并相同的部分来重建原始的trap。 

## 工作示例

 对于第一个样本：```
4 4
aaaa
1 3 4
3 1 1
3 1 1
2 a 3
```| 步骤| 运营| 当前字符串| 隔离段| 结果 |
 | ---| ---| ---| ---| ---|
 | 0 | 初始| 啊啊| | |
 | 1 | 删除 3 至 4 | 啊| | |
 | 2 | 查询1对1 | 啊| 一个 | 是的 |
 | 3 | 查询1对1 | 啊| 一个 | 是的 |
 | 4 | 在 3 | 处插入 a 啊啊| | |

 跟踪显示单字符间隔是自然处理的，因为它的正向和反向哈希是相同的。 

对于第二个样本：```
5 5
aaaaa
2 b 3
1 1 1
3 5 5
1 5 5
1 3 3
```| 步骤| 运营| 当前字符串| 隔离段| 结果 |
 | ---| ---| ---| ---| ---|
 | 0 | 初始| 啊啊啊| | |
 | 1 | 在 3 | 处插入 b 啊啊啊| | |
 | 2 | 删除1对1| 啊啊| | |
 | 3 | 查询 5 至 5 | 啊啊| 一个 | 是的 |
 | 4 | 删除 5 到 5 | 阿巴 | | |
 | 5 | 删除 3 至 3 | 阿坝| | |

 此示例演示了该结构在多次插入和删除后仍保持正确的位置。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(log n)`预计每次操作 | 每个操作执行恒定数量的trap分割和合并。 |
 | 空间|`O(n + q)`| treap存储当前字符，每次插入最多创建一个新节点。 |

 高达`3 * 10^5`操作，需要对数更新。 treap 避免重建字符串并将每个操作保持在预期限制内。 

## 测试用例```python
import sys
import io

# These tests assume the submitted solution is wrapped so solve() can be called.
# They are examples of the cases that should be checked.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("""4 4
aaaa
1 3 4
3 1 1
3 1 1
2 a 3
""") == "yes\nyes\n", "sample 1"

assert run("""5 5
aaaaa
2 b 3
1 1 1
3 5 5
1 5 5
1 3 3
""") == "yes\n", "sample 2"

assert run("""1 1
z
3 1 1
""") == "yes\n", "single character"

assert run("""3 3
abc
2 a 1
3 1 2
3 1 4
""") == "yes\nno\n", "insertion boundary"

assert run("""5 2
abcba
1 2 4
3 1 2
""") == "yes\n", "deletion leaving palindrome"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个字符 |`yes`| 处理尽可能最小的回文查询 |
 | 插入位置 1 |`yes`然后`no`| 检查插入索引 |
 | 删除中间部分 |`yes`| 检查移除后重建 |
 | 提供样品| 示例输出 | 确认标准行为 |

 ## 边缘情况

 单字符查询通过与其他查询相同的哈希比较来处理。 为了```
1 1
z
3 1 1
```孤立的陷阱仅包含`z`。 它的正向哈希和反向哈希都是`26`，所以答案是`yes`。 

在第一个位置插入是差一错误的常见来源。 为了```
3 2
abc
2 a 1
3 1 2
```分割点为零个字符。 新树变成了`aabc`，前两个字符是`aa`，所以两个哈希值都匹配，答案是`yes`。 

大型删除之所以有效，是因为删除的间隔表示为整个陷阱段。 为了```
5 2
abcba
1 2 4
3 1 2
```拆分删除了`bcb`，离开`aa`。 该查询隔离这两个字符并比较相等的哈希值，产生`yes`。 没有字符位置需要手动调整，因为trap结构已经代表了新的序列。
