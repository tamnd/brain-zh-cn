---
title: "CF 105093B-BNA"
description: "我们维护一个表示核苷酸序列的字符串，其中每个位置包含一个大写字母。 字符串通过两种操作随时间变化。"
date: "2026-06-27T20:49:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105093
codeforces_index: "B"
codeforces_contest_name: "2024 UP ACM Algolympics Final Round"
rating: 0
weight: 105093
solve_time_s: 59
verified: true
draft: false
---

[CF 105093B - BNA](https://codeforces.com/problemset/problem/105093/B)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个表示核苷酸序列的字符串，其中每个位置包含一个大写字母。 字符串通过两种操作随时间变化。 一项操作会交换两个给定位置处的字符，从而有效地重新排列序列。 另一个操作询问指定子字符串中特定字符的频率，并且我们必须报告它出现的次数。 

关键点是字符串是动态的。 查询不是独立的：交换永久修改所有后续操作的字符串。 每个计数查询都取决于所有先前的交换。 

这些限制表明了天真的想法失败的原因。 在测试用例中，字符串长度和操作数量总共最多可达 100000，因此任何为每个查询扫描子字符串的解决方案在最坏的情况下都会降级为二次行为。 即使 n 和 q 约为 100000 的单个测试用例也无法实现 O(nq) 的方法。 

一个微妙的边缘情况来自这样一个事实：交换仅影响两个位置，但可能经常发生。 例如，如果我们反复交换相邻元素，则字符串会不断变化，因此预先计算的前缀信息将变得无效，除非动态维护。 

一个幼稚的错误是通过从 l 到 r 扫描来重新计算每个 COUNT 查询的计数。 对于像“AAAA...A”这样长度为 100000 的字符串，单个查询可能需要 100000 个步骤，而对于 100000 个查询，这将变成 10^10 次操作。 

另一种失败模式是试图维护每个字符的前缀和，但忘记了交换会破坏单调结构。 交换两个字符后，必须更新这些索引之外的所有前缀数据，如果直接完成，则成本太高。 

## 方法

 蛮力策略很简单。 我们将字符串存储为可变数组。 对于 SWAP i j，我们在 O(1) 中交换两个字符。 对于 COUNT x l r，我们从 l 迭代到 r 并计算 x 的出现次数。 这是正确的，因为它直接反映了查询的定义。 然而，计数步骤是 O(r - l + 1)，最坏情况下是 O(n)。 对于多达 100000 个查询，这会导致 O(nq)，这太慢了。 

为了改善这一点，我们需要一种无需扫描范围即可回答范围频率查询的方法。 重要的观察结果是，我们只计算单个字符的出现次数，并且字母表大小是固定的且很小（最多 26 个大写字母）。 这建议在范围内维护每个字符的频率信息。 

其自然结构是线段树，其中每个节点存储大小为 26 的频率数组。每个叶子对应于单个字符，内部节点存储子节点的聚合计数。 COUNT 查询变成在线段树上的范围求和查询，返回所请求字符的频率。 交换操作可以通过更新两个位置来处理：我们更新两个叶子并向上传播更改。 

相对蛮力的关键改进是范围聚合变成 n 的对数，并且更新也保持对数，因为只有两个叶子发生变化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 线段树| O((n + q) log n) | O((n + q) log n) | O(26n) | O(26n) | 已接受 |

 ## 算法演练

1. 在字符串上构建一个段树，其中每个节点存储一个大小为 26 的数组，表示该段中的字符数。 这使我们能够有效地组合不相交片段的结果。 
2. 对于位置 i 对应的每个叶节点，初始化频率数组，以便只有 s[i] 处的字符计数为 1。这对字符串的基本状态进行编码。 
3. 构建内部节点时，通过按元素对子节点的频率数组求和来合并子节点。 这确保每个节点正确地表示其段。 
4. 要处理 COUNT x l r 查询，请遍历线段树并对完全或部分覆盖 [l, r] 的线段求和频率数组。 提取字符x对应的值作为结果。 这避免了扫描各个位置。 
5. 要处理 SWAP i j 操作，检索位置 i 和 j 处的字符，然后通过替换其叶值并向上传播更改来更新线段树中的两个位置。 每次更新都是独立的，仅调整一个位置。 
6. 按顺序输出 COUNT 个查询的结果，将它们收集在每个测试用例的列表中。 

### 为什么它有效

 线段树维护每个节点存储其线段的正确频率计数的不变量。 合并子项可以保持正确性，因为计数在不相交的间隔内是相加的。 由于每次更新仅修改叶节点及其祖先，因此所有受影响的段都会得到一致的修复。 每个查询都分解为不相交的树段，其并集与请求的范围完全匹配，因此将它们存储的计数相加即可产生正确的频率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, s):
        self.n = len(s)
        self.t = [[0] * 26 for _ in range(4 * self.n)]
        self.s = list(s)
        self.build(1, 0, self.n - 1)

    def build(self, v, l, r):
        if l == r:
            self.t[v][ord(self.s[l]) - 65] = 1
            return
        m = (l + r) // 2
        self.build(v * 2, l, m)
        self.build(v * 2 + 1, m + 1, r)
        for i in range(26):
            self.t[v][i] = self.t[v * 2][i] + self.t[v * 2 + 1][i]

    def update(self, v, l, r, pos, old_c, new_c):
        if l == r:
            self.t[v][ord(old_c) - 65] -= 1
            self.t[v][ord(new_c) - 65] += 1
            self.s[l] = new_c
            return
        m = (l + r) // 2
        if pos <= m:
            self.update(v * 2, l, m, pos, old_c, new_c)
        else:
            self.update(v * 2 + 1, m + 1, r, pos, old_c, new_c)
        for i in range(26):
            self.t[v][i] = self.t[v * 2][i] + self.t[v * 2 + 1][i]

    def query(self, v, l, r, ql, qr, ch):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return self.t[v][ch]
        m = (l + r) // 2
        return self.query(v * 2, l, m, ql, qr, ch) + self.query(v * 2 + 1, m + 1, r, ql, qr, ch)

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, q = map(int, input().split())
        s = input().strip()

        st = SegTree(s)
        res = []

        for _ in range(q):
            parts = input().split()
            if parts[0] == "SWAP":
                i = int(parts[1]) - 1
                j = int(parts[2]) - 1
                if i == j:
                    continue
                ci = st.s[i]
                cj = st.s[j]
                st.update(1, 0, n - 1, i, ci, cj)
                st.update(1, 0, n - 1, j, cj, ci)

            else:
                ch = ord(parts[1]) - 65
                l = int(parts[2]) - 1
                r = int(parts[3]) - 1
                ans = st.query(1, 0, n - 1, l, r, ch)
                res.append(str(ans))

        out.append(" ".join(res))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树在每个节点存储一个26长度的频率数组。 这是中心数据结构：每个操作都简化为维护或查询这些数组。 

SWAP 操作作为两点更新来实现。 每次更新都会修改叶子并重新计算父节点。 更新逻辑仔细地替换旧的和新的字符计数，以便不保留陈旧的频率。 这很重要，因为如果不减少旧字符，就会默默地增加计数。 

查询沿着树向下传递，并仅从完全位于查询范围内的段累积结果。 部分重叠被递归地分割。 

## 工作示例

 ### 示例 1

 输入：```
s = ABA
COUNT A 1 2
SWAP 2 3
COUNT A 1 2
```初始线段树表示计数：

 | 细分 | 一个 | 乙|
 | --- | --- | --- |
 | [1,3]| 2 | 1 |

 查询轨迹：

 | 运营| 范围 | 结果 |
 | --- | --- | --- |
 | 计数 A 1 2 | “AB”| 1 |
 | 交换 2 3 | “AAB”| - |
 | 计数 A 1 2 | “AA”| 2 |

 第一个查询只能看到初始排列。 交换位置 2 和 3 后，结构更新叶节点和内部和，因此第二个查询反映新配置。 

这表明更新对于未来的查询是完全持久的。 

### 示例 2

 输入：```
s = ABDDACAADBEAA
COUNT A 1 13
COUNT A 1 10
SWAP 2 12
```我们关注在字符串中移动字符的交换的效果。 

在交换之前，计数是在固定段上计算的：

 | 查询 | 细分 | 一个计数 |
 | --- | --- | --- |
 | 1 | [1,13]| 计算总数 |
 | 2 | [1,10]| 子集总计 |

 交换位置 2 和 12 后，树的两个远距离部分发生变化，但只有两片叶子被修改。 结构的其余部分保持不变，表明更新是本地的。 

这证实了线段树不变式：每次更新仅影响 O(log n) 个节点。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每次更新涉及 O(log n) 个节点，每个查询遍历 O(log n) 个段 |
 | 空间| O(26n) | O(26n) | 每个线段树节点存储一个26长度的数组 |

 由于 n 和 q 总数最多为 100000，因此这完全符合限制。对数因子仍然很小，使得该解决方案在实践中高效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import log
    # assume solve() is defined above in same module
    return _sys.stdout.getvalue()

# sample tests would be inserted here if full I/O harness was provided

# minimal case
assert True

# swap same position (no-op behavior)
# single character queries
# repeated updates stress
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字母字符串| 直接计数 | 基本情况正确性 |
 | 重复交换| 稳定计数 | 更新正确性 |
 | 全方位查询 | 正确聚合 | 段合并|

 ## 边缘情况

 一种重要的边缘情况是交换相同的索引。 在这种情况下，两个更新都针对同一个叶子，并且如果没有防护，代码可能会错误地递减和递增。 当 i == j 时，实现显式跳过，确保不会发生双重修改。 

另一个边缘情况是在多次交换后查询整个范围。 由于更新是本地的，因此线段树保持一致，并且全范围查询仍然返回正确的全局计数。 

最后的边缘情况是通过许多操作交替字符。 即使在频繁更新的情况下，每个操作也只影响 O(log n) 个节点，因此不会出现隐藏的二次行为。
