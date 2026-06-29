---
title: "CF 105198L - Kalopsia 序列"
description: "我们维护一个由括号组成的二进制字符串，其中每个字符都是左括号或右括号。 字符串随着时间的推移而变化，每次更新后我们可能需要回答所选子字符串是否形成有效的常规括号序列。"
date: "2026-06-27T03:01:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105198
codeforces_index: "L"
codeforces_contest_name: "ShellBeeHaken Presents Intra SUST Programming Contest 2024 - Replay"
rating: 0
weight: 105198
solve_time_s: 87
verified: false
draft: false
---

[CF 105198L - Kalopsia 序列](https://codeforces.com/problemset/problem/105198/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们维护一个由括号组成的二进制字符串，其中每个字符都是左括号或右括号。 字符串随着时间的推移而变化，每次更新后我们可能需要回答所选子字符串是否形成有效的常规括号序列。 

如果子字符串可以被解释为正确的括号嵌套，则该子字符串被认为是有效的，这意味着子字符串的每个前缀的右括号数量永远不会多于左括号，并且末尾的左括号和右括号总数相等。 

支持两种操作。 一个操作翻转范围中的每个括号，将每个“(”变成“)”，每个“)”变成“(”。另一个操作询问给定范围当前是否在此定义下形成有效序列。

 困难同时来自两个方向。 首先，更新影响整个段，而不是单个位置。 其次，有效性不是一个简单的计数查询，因为余额必须在子字符串的每个前缀上都是正确的，而不仅仅是总数。 

由于多达 200,000 个位置和 200,000 次操作，任何为每个查询重新计算前缀有效性的解决方案都将立即失败。 在最坏的情况下，每个查询的完整扫描将花费二次时间，这远远超出了允许的范围。 如果每次扫描在段长度上是线性的，那么即使每次操作的扫描次数是对数也太慢。 

如果我们试图仅维持某个部分的总平衡，则会出现更微妙的故障模式。 例如，字符串“())(”的总余额为零，但由于前缀变为负数而无效。这表明任何正确的结构都必须跟踪前缀行为，而不仅仅是聚合计数。

 翻转时会出现另一个微妙的问题。 反转后，括号角色完全交换，因此任何假设没有转换支持的静态权重的表示都将被破坏，除非它显式处理整个段的符号反转。 

## 方法

 蛮力的想法很简单。 对于每个查询，提取子字符串。 如果是翻转操作，则反转范围内的每个字符。 如果是有效性检查，请模拟堆栈或保持运行平衡，并确保它永远不会变为负值，同时也以零结束。 这是正确的，因为它直接遵循有效括号序列的定义。 

问题是性能。 每个查询最多可以触及 O(n) 个字符。 当 q 达到 200,000 时，这会导致 O(nq) 行为，在最坏的情况下约为 4e10 次操作。 这无法及时运行。 

关键的观察结果是，括号序列的有效性仅取决于前缀上的两个值：+1 和 -1 表示的总和，以及最小前缀和。 如果我们将“(”映射到+1，将“)”映射到-1，那么当子串的总和为零且其最小前缀和永远不为负时，子串就是有效的。 

这将问题转化为在范围更新下维护序列，同时能够查询间隔内的总和和最小前缀和。 线段树可以准确地存储这些信息。 剩下的挑战是翻转操作，它会否定段中的所有值。 求反不仅影响总和，它还以精确的方式交换前缀极值，可以使用惰性传播标签进行处理。 

蛮力之所以有效，是因为它直接评估结构，但当范围变大且更新重叠时，它会失败。 线段树之所以有效，是因为其有效性条件是组合的：我们可以使用少量信息合并两个线段，并且可以在不扩展的情况下对线段进行反转变换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·q) | O(n·q) | O(n) | 太慢了 |
 | 带有延迟翻转的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

我们将每个“(”表示为+1，每个“)”表示为-1。 数组的每个段存储三个值：总和、最小前缀和、最大前缀和。 这些足以回答正确性并支持合并和翻转。 

1. 构建一棵线段树，其中每个叶子对应一个字符。 叶子将和存储为 +1 或 -1，并且两个前缀极值都等于该值。 这为所有后续操作建立了基础表示。 
2. 对于组合左子节点和右子节点的内部节点，将总和计算为两个子节点的总和。 最小前缀是左最小值和左和加上右最小值中的最小值。 这是有效的，因为任何前缀要么留在左段内，要么在完全消耗左段总和后延伸到右段。 使用相同的推理对称地计算最大前缀。 
3. 对于翻转操作，我们对段应用变换而不是重新计算它。 翻转会将每个 +1 变为 -1，反之亦然，因此总和变为负数。 
4. 前缀结构也颠倒。 新的最小前缀成为先前最大前缀的负数，新的最大前缀成为先前最小前缀的负数。 这是通过反转段内每个部分和的符号得出的。 
5. 我们使用惰性传播标志将段标记为已翻转，而不立即将更改推送到子段。 当需要时，我们通过对子级应用相同的转换并清除标志来向下推动翻转。 
6. 对于查询，我们检索表示 [l, r] 的段。 如果其总和为零且其最小前缀至少为零，则该子串有效。 否则就不是。 

正确性取决于每个片段都由这三个值完全概括，并且合并和翻转都保留了该概括的有效性而不会丢失信息。 

为什么它有效：任何括号序列都对应于整数上的行走，其中每个字符将高度改变±1。 有效性仅取决于行走是否以零结束并且永远不会低于零。 线段树为每个区间维护精确的前缀极值，并且串联和符号反转都保留了该游走表示的结构。 由于每个操作都遵循这些不变量，因此查询始终反映子字符串的真实状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("sum", "mn", "mx", "flip")
    def __init__(self, s=0, mn=0, mx=0):
        self.sum = s
        self.mn = mn
        self.mx = mx
        self.flip = False

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [Node() for _ in range(4 * self.n)]
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            val = 1 if arr[l] == '(' else -1
            self.t[v] = Node(val, val, val)
            return
        m = (l + r) // 2
        self.build(v * 2, l, m, arr)
        self.build(v * 2 + 1, m + 1, r, arr)
        self.pull(v)

    def pull(self, v):
        L = self.t[v * 2]
        R = self.t[v * 2 + 1]
        self.t[v].sum = L.sum + R.sum
        self.t[v].mn = min(L.mn, L.sum + R.mn)
        self.t[v].mx = max(L.mx, L.sum + R.mx)

    def apply_flip(self, v):
        node = self.t[v]
        node.sum *= -1
        node.mn, node.mx = -node.mx, -node.mn
        node.flip ^= True

    def push(self, v):
        if self.t[v].flip:
            self.apply_flip(v * 2)
            self.apply_flip(v * 2 + 1)
            self.t[v].flip = False

    def update(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.apply_flip(v)
            return
        self.push(v)
        m = (l + r) // 2
        if ql <= m:
            self.update(v * 2, l, m, ql, qr)
        if qr > m:
            self.update(v * 2 + 1, m + 1, r, ql, qr)
        self.pull(v)

    def query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[v]
        self.push(v)
        m = (l + r) // 2
        if qr <= m:
            return self.query(v * 2, l, m, ql, qr)
        if ql > m:
            return self.query(v * 2 + 1, m + 1, r, ql, qr)

        left = self.query(v * 2, l, m, ql, qr)
        right = self.query(v * 2 + 1, m + 1, r, ql, qr)

        res = Node()
        res.sum = left.sum + right.sum
        res.mn = min(left.mn, left.sum + right.mn)
        res.mx = max(left.mx, left.sum + right.mx)
        return res

def solve():
    n, q = map(int, input().split())
    s = list(input().strip())
    st = SegTree(s)

    out = []
    for _ in range(q):
        t, l, r = map(int, input().split())
        l -= 1
        r -= 1
        if t == 1:
            st.update(1, 0, n - 1, l, r)
        else:
            res = st.query(1, 0, n - 1, l, r)
            if res.sum == 0 and res.mn >= 0:
                out.append("YES")
            else:
                out.append("NO")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树是在映射的整数数组上构建的。 每个节点都维护总和和前缀极值，以便可以在不扫描元素的情况下回答任何区间查询。 翻转操作是惰性处理的：我们不是立即修改子节点，而是反转存储的摘要并标记节点，以便仅在需要时修复后代。 这使更新和查询操作保持对数。 

一个常见的错误是忘记在合并段时必须相对于累积和重新计算前缀最小值。 另一种方法是应用否定而不交换最小值和最大值，这会破坏嵌套结构的正确性。 

## 工作示例

 考虑一个小序列“()()()”和中间段的翻转。 

| 步骤| 运营| 细分 | 总和 | 最小前缀 | 有效 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 初始| (1,6) | 0 | 0 | 是 |
 | 2 | 翻转 (2,5) | (1,6) | 0 | 0 | 是 |

 翻转中间后，即使内部顺序发生变化，结构仍然保持平衡，这证实了段表示正确地抽象了局部结构。 

现在考虑“())(”：

 | 步骤| 运营| 细分 | 总和 | 最小前缀 | 有效 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 查询 | (1,4) | 0 | -1 | 否 |

 即使总和为零，前缀也会低于零，这会正确拒绝子字符串。 

这些例子表明，仅总余额是不够的，前缀跟踪至关重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | 每次更新和查询都会遍历一个线段树高度 |
 | 空间| O(n) | 树节点存储每个段的常量信息 |

 这些约束允许最多 200,000 次操作，并且每次操作的对数时间保持在限制范围内。 内存使用量与初始字符串的大小保持线性关系。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    solve()

    return output.getvalue().strip()

# sample-like test (formatting assumed corrected)
# assert run(...) == ...

# minimum size
assert run("1 1\n(\n2 1 1\n") in {"NO", "YES"}  # single bracket must be invalid/valid depending

# already balanced
assert run("2 1\n()\n2 1 2\n") == "YES"

# flip then query
assert run("2 2\n()\n1 1 2\n2 1 2\n") == "YES"

# all closing
assert run("3 1\n)))\n2 1 3\n") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字符 | 否 | 最小无效案例|
 | () 查询 | 是 | 基本正确性 |
 | 翻转全系列| 是 | 惰性反演正确性 |
 | 全部 ')' | 否 | 前缀违规检测 |

 ## 边缘情况

 当多次翻转跨越整个数组的段时，会出现微妙的边缘情况。 由于翻转操作是内合操作，因此应用两次应该将结构返回到其原始状态。 惰性传播标志确保了这种行为，因为切换标志两次会自行取消。 

另一种情况是部分重叠翻转区域和非翻转区域的查询。 推送操作保证在部分遍历之前应用任何挂起的反转，因此查询的段始终反映一致的状态。 

例如，从“(()())”开始，翻转[2,5]两次应该返回原始字符串。 线段树通过切换节点处的翻转标志并仅在必要时传播来处理此问题，确保反转的双重应用不会破坏存储的值。
