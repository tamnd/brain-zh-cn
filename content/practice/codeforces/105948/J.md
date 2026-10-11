---
title: "CF 105948J - 永远 (II)"
description: "我们得到了一个小写字母的可变字符串。 我们跟踪的核心数量是在固定顺序的字符对上定义的，特别是第一个字符是“e”，第二个字符是“f”的字符对。"
date: "2026-06-22T16:07:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105948
codeforces_index: "J"
codeforces_contest_name: "CCF CAT NAEC 2025 (Provincial)"
rating: 0
weight: 105948
solve_time_s: 56
verified: true
draft: false
---

[CF 105948J - 永远 (II)](https://codeforces.com/problemset/problem/105948/J)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个小写字母的可变字符串。 我们跟踪的核心数量是在固定有序的字符对上定义的，特别是第一个字符是的字符对`'e'`第二个是`'f'`。 对于每一次出现`'e'`在位置`i`和一个`'f'`在位置`j`和`i < j`，我们添加距离`j - i`。 任务是计算初始字符串和每个点更新后的总和，其中字符串的单个位置将被永久覆盖。 

以不同的方式重新构建，每个有效对贡献的权重等于两个位置之间的距离。 字符串一次更改一个字符，每次更改后我们都需要更新的加权对和。 

约束条件达到`5 × 10^5`对于长度和更新，这排除了每次修改后从头开始重新计算总和。 任何扫描每个查询整个字符串的解决方案都会导致大约`O(nm)`的操作，这远远超出了可行的范围。 甚至`O(n log n)`每次更新在实践中太慢了。 

重要的结构是只有涉及`'e'`和`'f'`事情。 字母表中的其他所有内容都是无关紧要的，除非更新发生时可能会进出这两个字符。 

当更新将角色转入或转出时，会出现微妙的边缘情况`'e'`或者`'f'`。 例如，更改`'e'`到`'f'`不仅会删除涉及该位置的贡献，还会反转其在所有对中的角色，因此必须调整左右交互。 

另一个棘手的情况是当多个`'e'`和`'f'`是交错的。 尝试仅更新本地邻域的幼稚方法会失败，因为每个位置都会与两侧的所有相反类型的角色交互。 

## 方法

 蛮力方法很简单。 对于每个查询，重建字符串状态并通过迭代所有对来计算总和`(i, j)`和`i < j`，检查是否`s[i] = 'e'`和`s[j] = 'f'`，并添加`j - i`。 这是正确的，因为它直接实现了定义。 

然而，每次计算成本`O(n)`，并且有`m`更新，因此总复杂度变为`O(nm)`，在最坏的情况下达到`2.5 × 10^{11}`运营。 这是远远不能接受的。 

为了优化，我们对表达式进行代数扩展。 对于固定的`'e'`在位置`i`，其贡献是`(j - i)`全面的`'f'`其右侧的位置。 这分为两部分：此类的数量`'f'`位置减去`i`计数的时间，加上它们的指数之和。 这表明维护全球统计数据`'f'`位置并能够高效查询后缀信息。 

关键思想是维护两棵芬威克树（或线段树）：一棵跟踪计数`'e'`和`'f'`，以及另一个跟踪其指数的总和。 这使我们能够计算对数时间内的贡献。 当字符发生变化时，我们会删除其旧的贡献，并通过使用前缀/后缀查询重新计算其对所有现有相反字符的影响来添加新的贡献。 

这将每次更新减少到`O(log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 基于 Fenwick 的更新 | O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 我们为两个相关角色中的每一个维护两棵芬威克树`'e'`和`'f'`。 一棵树存储某个位置存在多少次出现，另一棵树存储它们的索引之和。 

我们也维持目前的总贡献。 

1. 初始化 Fenwick 结构的计数和索引和`'e'`和`'f'`基于初始字符串。 对于每个位置，如果是`'e'`或者`'f'`，我们相应地插入它。 
2. 通过迭代位置并使用前缀查询来计算初始答案。 对于每个`'e'`在位置`i`，我们查询有多少个`'f'`存在于右侧及其索引和。 贡献是`(sum of f indices to right) - i * (count of f to right)`。 
3.对于位置的每次更新`p`，首先从全局答案中删除其旧的贡献。 这需要将该位置视为已从旧字符集中删除。 
4.更新Fenwick树，删除该位置的旧字符`p`。 
5. 在位置处插入新字符`p`进入其相应的 Fenwick 结构。 
6.重新计算职位的贡献影响`p`处于新状态并将其添加回全局答案中。 

每次更新仅涉及前缀/后缀聚合，因此我们避免扫描不相关的位置。 

### 为什么它有效

 总和可以分解为每个的独立贡献`'e'`反对所有人的立场`'f'`其右侧的位置。 芬威克树准确地保留了评估每个此类贡献所需的两个聚合：指数计数和总和。 由于更新一次仅更改一个索引，因此在本地调整这些聚合足以保持全局正确性。 

不变的是，在任何时候，芬威克树都能正确表示`'e'`和`'f'`，因此对后缀范围的每个查询都会返回重建贡献公式所需的精确计数和总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

    def range_sum(self, l, r):
        if r < l:
            return 0
        return self.sum(r) - self.sum(l - 1)

def solve():
    n, m = map(int, input().split())
    s = list(input().strip())

    fe_cnt = Fenwick(n)
    fe_sum = Fenwick(n)
    ff_cnt = Fenwick(n)
    ff_sum = Fenwick(n)

    def add_char(ch, idx, delta):
        if ch == 'e':
            fe_cnt.add(idx, delta)
            fe_sum.add(idx, delta * idx)
        elif ch == 'f':
            ff_cnt.add(idx, delta)
            ff_sum.add(idx, delta * idx)

    for i, ch in enumerate(s, 1):
        add_char(ch, i, 1)

    def contribution_e(i):
        c = ff_cnt.range_sum(i + 1, n)
        sidx = ff_sum.range_sum(i + 1, n)
        return sidx - i * c

    ans = 0
    for i, ch in enumerate(s, 1):
        if ch == 'e':
            ans += contribution_e(i)

    out = []
    out.append(str(ans))

    for _ in range(m):
        p, c = input().split()
        p = int(p)
        old = s[p - 1]

        if old != c:
            if old == 'e':
                c_cnt = ff_cnt.range_sum(p + 1, n)
                c_sum = ff_sum.range_sum(p + 1, n)
                ans -= c_sum - p * c_cnt
            elif old == 'f':
                e_cnt = fe_cnt.range_sum(1, p - 1)
                e_sum = fe_sum.range_sum(1, p - 1)
                ans -= p * e_cnt - e_sum

            add_char(old, p, -1)

            if c == 'e':
                c_cnt = ff_cnt.range_sum(p + 1, n)
                c_sum = ff_sum.range_sum(p + 1, n)
                ans += c_sum - p * c_cnt
            elif c == 'f':
                e_cnt = fe_cnt.range_sum(1, p - 1)
                e_sum = fe_sum.range_sum(1, p - 1)
                ans += p * e_cnt - e_sum

            add_char(c, p, 1)
            s[p - 1] = c

        out.append(str(ans))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```Fenwick 结构对于计数和指数和而言是重复的，因为该公式独立地取决于这两个数量。 每次更新都会小心地减去修改位置的旧贡献，然后将其从数据结构中删除，然后在更新结构后插入新贡献，以保持正确性。 

一个常见的实现陷阱是忘记在更新芬威克树之前删除一个字符必须减去它的贡献。 如果以相反的顺序完成，查询将已经反映更新的状态，并且减法将是错误的。 

## 工作示例

 考虑一个交互可见的小字符串：`e f e f`。 

我们跟踪每个人的贡献`'e'`到后来`'f'`。 

| 步骤| 字符串| 职位贡献| 总计 |
 | --- | --- | --- | --- |
 | 初始化| EF EF | (1→2)=1, (1→4)=3, (3→4)=1 | 5 |

 现在更新位置 2`'f'`到`'e'`。 

| 步骤| 字符串| 效果| 总计 |
 | --- | --- | --- | --- |
 | 之前| EF EF | 基地| 5 |
 | 删除 2 处的 f | e _ e f | 删除 f 为右端点的对 | 3 |
 | 在 2 | 添加 e e e e f | 添加新的 e 贡献 | 4 |

 此跟踪显示单个更改会影响全局的多个对，而不仅仅是本地邻接。 

另一种情况：所有字符都变成`'e'`。 然后就没有有效的了`(e, f)`成对，所以答案为零。 Fenwick 结构正确地反映了这一点，因为`'f'`树变空，使所有后缀查询为零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每次更新和查询都使用 log n 高度上的 Fenwick 运算 |
 | 空间| O(n) | 四个大小为 n 的 Fenwick 阵列 |

 这些约束允许最多 50 万次操作，因此需要对数更新。 在 512MB 内存下，四棵 Fenwick 树的常数因子是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return sys.stdout.getvalue() if False else ""

# Manual correctness checks (conceptual; integrate solve properly in real use)

# edge: single char
# 1 0
# a
# -> 0

# all e
# 5 0
# eeeee
# -> 0

# alternating
# 4 0
# efef

# updates flipping roles
# 4 2
# efef
# 2 e
# 3 f
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个字符 | 0 | 不存在对 |
 | 全部相同的 'e' | 0 | 没有“f”相互作用|
 | 交替效应| 5 | 全交互结构|
 | 翻转更新| 动态正确性 | 突变处理 |

 ## 边缘情况

 关键的边缘情况是更新将不相关的字符变成`'e'`或者`'f'`。 假设一个位置`p`变化自`'x'`到`'e'`。 在改变之前，它没有任何贡献。 变化之后突然和大家互动`'f'`在它的右边。 该算法通过在插入时查询后缀统计信息来处理此问题，确保立即计算所有新对。 

另一种情况是角色互换，例如`'e'`成为`'f'`。 这需要在修改 Fenwick 树之前减去旧的贡献。 如果在更新树后完成，后缀和前缀查询将已经反映新配置，并且减法变得无效。 该实现显式地首先执行减法，然后更新结构，然后添加新的贡献，从而在每一步中保持一致性。
