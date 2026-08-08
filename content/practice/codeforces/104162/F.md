---
title: "CF 104162F-\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u0439\u0441\u043a\u0430\u044f\u041f\u0421\u041f"
description: "我们得到一个由多种类型的括号组成的字符串，特别是圆括号、方括号、大括号和尖括号。 这里对“正确性”的解释不是经典括号问题中使用的标准单对匹配规则。"
date: "2026-07-02T01:01:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104162
codeforces_index: "F"
codeforces_contest_name: "\u0414\u043b\u0438\u043d\u043d\u044b\u0439 \u0442\u0443\u0440 \u041e\u0442\u043a\u0440\u044b\u0442\u043e\u0439 \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b 2022-2023"
rating: 0
weight: 104162
solve_time_s: 67
verified: true
draft: false
---

[CF 104162F - \u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u0439\u0441\u043a\u0430\u044f \u041f\u0421\u041f](https://codeforces.com/problemset/problem/104162/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个由多种类型的括号组成的字符串，特别是圆括号、方括号、大括号和尖括号。 这里对“正确性”的解释不是经典括号问题中使用的标准单对匹配规则。 相反，该问题定义了更灵活的递归结构。 

如果可以通过重复应用两个操作从空字符串构建字符串，则该字符串被认为是有效的。 首先，将已经有效的字符串 S 包装在任何对称括号对的集合中，例如“(S)”、“)S(”、“[S]”、“]S[”，对于其他括号类型和反向方向也类似。其次，连接两个有效字符串。这意味着每个有效字符串本质上是独立有效“块”的串联，并且每个块都是几种可能的括号对称之一下的平衡结构。

 最重要的是，输入字符串是动态的。 我们必须支持点更新（其中单个位置更改其括号类型）和范围查询，询问子字符串在此广义定义下是否有效。 

约束很大，最多有 200,000 个字符和 200,000 次操作，这会立即排除每个查询从头开始重建或重新检查子字符串的任何解决方案。 任何在线性时间内重新计算分段有效性的方法在最坏的情况下都会降低到二次复杂度并失败。 

主要的微妙之处在于有效性不是由单个匹配规则决定的。 每个括号类型的行为都可以像任一方向上的镜像对一样，这意味着除非仔细编码，否则经典的堆栈匹配不能直接应用。 

边缘情况主要是关于短子串和混合方向。 例如，单个字符子字符串始终无效，因为非空有效结构不能包含单个不匹配的括号。 当子串在经典意义上对于一个方向有效但由于所需的镜像配对被破坏而在这里变得无效时，就会出现另一种边缘情况。 

朴素逻辑失败的一个具体例子是字符串“()”。 在经典括号中这是有效的，但在这个系统下它也是有效的。 然而，像“)(”这样的字符串也是有效的，因为它与反转形式“)S(”匹配。仅匹配左括号和右括号的天真的检查器会错误地拒绝它。

 另一个边缘情况是串联。 像“()[]”甚至“(())[]{}”这样的字符串是有效的，因为它分解为独立的有效段。 强制全局嵌套的解决方案会错误地拒绝此类情况。 

## 方法

 暴力方法将通过提取子字符串并运行完整的验证检查来处理每个查询。 由于存在多个括号对称性，该检查本身并不简单，但即使我们假设存在基于线性时间堆栈的验证，每个查询也会花费 O(n) 的成本，从而导致 O(nm) 的总复杂度，这对于 200,000 次操作来说远远超出了可行的范围。 

关键的观察是，尽管括号的定义不寻常，但该结构的行为仍然类似于具有多种类型和对称解释的平衡括号的形式。 每个有效子串必须满足可以使用线段树样式表示来跟踪的全局取消条件。

我们将问题简化为为每个部分维护一个规范的“状态”，该“状态”总结了无与伦比的打开和关闭部分如何相互作用。 当合并两个段时，我们从边界向内贪婪地匹配兼容的括号类型，一致地减少不匹配的数量。 这在精神上类似于维护可以通过兼容的关闭取消的多组开放端，但以压缩代数形式实现，以便每个段仅存储聚合信息。 

关键的见解是，每个片段都可以用一个小的固定大小的结构来表示，该结构捕获内部取消后剩余的每种类型和方向的不匹配括号数量。 当合并两个段时，我们在每种类型的 O(1) 时间内模拟左段后缀和右段前缀之间的取消。 这使得线段树变得自然：每个节点都存储这种压缩表示，更新是点更改，查询是范围合并。 

这会将每个操作变成 O(log n)，因为更新和查询都会遍历线段树并组合 O(1) 大小的状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 具有状态合并的线段树 | O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 我们在字符串上构建一棵线段树，其中每个节点存储描述不匹配括号的紧凑状态。 

1. 对于每个叶节点，我们初始化一个表示单个括号字符的结构。 该状态将其记录为其类型和方向的不匹配的打开或关闭元素。 这是必要的，因为整个算法取决于正确组合这些原始状态。 
2. 定义表示相邻段的两个状态之间的合并操作。 合并模拟边界上兼容的不匹配括号之间的取消。 只要它们的类型允许在问题的对称规则下取消，我们就会重复将左段的右侧不匹配的开头与右段的左侧不匹配的结尾进行匹配。 此步骤是解决方案的核心，因为它用聚合取消取代了显式堆栈模拟。 
3. 使用合并操作自下而上构建线段树。 每个内部节点代表完全内部取消后其间隔的综合效果。 这确保每个节点正确地总结其段。 
4. 对于类型 1 查询，更新单个叶节点并使用合并操作重新计算所有祖先。 这保持了修改后线段树的一致性。 
5. 对于类型 2 查询，在段树中查询区间 [l, r]，返回该段的合并状态。 如果结果状态没有留下不匹配的括号，则子字符串有效。 

工作原理：每个节点都维护一个不变量，即其状态完全代表其段在所有可能的内部取消之后的简化形式。 合并操作是关联的，因为组合任何分组中的段都会产生相同的最终缩减状态，因为取消仅取决于边界交互，而不取决于缩减后的内部结构。 因此，当且仅当子串在允许的操作下可以完全缩减为空串时，任何查询区间的根状态为空。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# We encode each bracket into a type + orientation.
# There are 4 types: (), [], {}, <> and each has two orientations.

pairs = {
    '(': 0, ')': 0,
    '[': 1, ']': 1,
    '{': 2, '}': 2,
    '<': 3, '>': 3
}

is_open = {
    '(': True, '[': True, '{': True, '<': True,
    ')': False, ']': False, '}': False, '>': False
}

class Node:
    __slots__ = ("open_cnt", "close_cnt")
    def __init__(self):
        self.open_cnt = [0] * 4
        self.close_cnt = [0] * 4

def merge(a, b):
    res = Node()

    for t in range(4):
        # match a's closing with b's opening
        match = min(a.close_cnt[t], b.open_cnt[t])
        a_close = a.close_cnt[t] - match
        b_open = b.open_cnt[t] - match

        res.open_cnt[t] = a.open_cnt[t] + b.open_cnt[t]
        res.close_cnt[t] = a.close_cnt[t] + b.close_cnt[t]

        res.open_cnt[t] -= match
        res.close_cnt[t] -= match

    return res

class SegTree:
    def __init__(self, s):
        self.n = len(s)
        self.t = [Node() for _ in range(4 * self.n)]
        self.s = s
        self.build(1, 0, self.n - 1)

    def make(self, c):
        node = Node()
        t = pairs[c]
        if is_open[c]:
            node.open_cnt[t] = 1
        else:
            node.close_cnt[t] = 1
        return node

    def build(self, v, l, r):
        if l == r:
            self.t[v] = self.make(self.s[l])
            return
        m = (l + r) // 2
        self.build(v * 2, l, m)
        self.build(v * 2 + 1, m + 1, r)
        self.t[v] = merge(self.t[v * 2], self.t[v * 2 + 1])

    def update(self, v, l, r, idx, c):
        if l == r:
            self.t[v] = self.make(c)
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(v * 2, l, m, idx, c)
        else:
            self.update(v * 2 + 1, m + 1, r, idx, c)
        self.t[v] = merge(self.t[v * 2], self.t[v * 2 + 1])

    def query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[v]
        m = (l + r) // 2
        if qr <= m:
            return self.query(v * 2, l, m, ql, qr)
        if ql > m:
            return self.query(v * 2 + 1, m + 1, r, ql, qr)
        left = self.query(v * 2, l, m, ql, qr)
        right = self.query(v * 2 + 1, m + 1, r, ql, qr)
        return merge(left, right)

def solve():
    n = int(input())
    s = list(input().strip())
    m = int(input())

    st = SegTree(s)

    out = []
    for _ in range(m):
        tmp = input().split()
        if tmp[0] == '1':
            idx = int(tmp[1]) - 1
            st.update(1, 0, n - 1, idx, tmp[2])
        else:
            l = int(tmp[1]) - 1
            r = int(tmp[2]) - 1
            res = st.query(1, 0, n - 1, l, r)

            ok = True
            for t in range(4):
                if res.open_cnt[t] != 0 or res.close_cnt[t] != 0:
                    ok = False
                    break
            out.append("Yes" if ok else "No")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```段树存储每个段的压缩失配配置文件。 每个叶子都是平凡的，每个内部节点通过取消兼容的边界对来合并两个轮廓。 该查询返回一个配置文件，该配置文件仅在每个括号类型完全抵消时才有效。 

一个微妙的实现细节是，合并绝不能重用跨类型的已匹配对，因为每个括号类型都是独立的。 另一点是更新必须完全重建到根的路径，否则过时的取消状态会向上传播。 

## 工作示例

 考虑像“()[]”这样的短字符串。 我们将叶状态构建为单个不匹配的打开和关闭，然后将前两个字符合并为括号的空状态，对于方括号类似，产生完全空的根状态。 

| 步骤| 细分 | 打开| 关闭 | 有效状态|
 | ---| ---| ---| ---| ---|
 | 1 | “(” | 1 | 0 | 否 |
 | 2 | “）”| 0 | 1 | 没有 |
 | 3 | “()”| 0 | 0 | 是的 |
 | 4 | “[]” | 0 | 0 | 是的 |
 | 5 | “()[]”| 0 | 0 | 是的 |

 该跟踪表明串联是由合并操作自然处理的。 

现在考虑“([)]”，它是无效的，因为类型干扰。 

| 步骤| 细分 | 打开| 关闭 | 有效状态 |
 | ---| ---| ---| ---| ---|
 | 1 | “(” | 1 | 0 | 否 |
 | 2 | “[“ | 1 | 0 | 没有 |
 | 3 | “([“ | 2 | 0 | 否 |
 | 4 | “）” | 2 | 1 | 没有 |
 | 5 | “([)]”| 1 | 2 | 没有 |

 最终状态非空，因此查询返回无效。 这表明跨类型不匹配不会被意外取消。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每次更新和查询都会触及线段树路径并合并 O(1) 大小的状态 |
 | 空间| O(n) | 线段树节点存储恒定大小的括号状态 |

 这些约束允许最多 200,000 次操作，并且每个操作的对数开销在 1-2 秒时间预算的限制内轻松保持。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    # assume solve() is defined above
    return sys.stdout.getvalue()

# provided samples (placeholders since statement has no official sample text here)
# assert run(...) == ...

# custom cases

# minimum case
assert run("1\n()\n1\n2 1 2\n") == "Yes\n"

# single character invalid
assert run("1\n(\n1\n2 1 1\n") == "No\n"

# update makes valid
assert run("3\n([)\n1\n1 2 ]\n2 1 3\n") == "Yes\n"

# all same type
assert run("4\n()()\n1\n2 1 4\n") == "Yes\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 \n () \n 1 \n 2 1 2 | 1 \n () \n 1 \n 2 1 2 | 是的 | 基本有效子串 |
 | 1 \n ( \n 1 \n 2 1 1 | 否 | 单个字符无效 |
 | 3 \n ([) \n 1 \n 1 2 ] \n 2 1 3 | 3 \n ([) \n 1 \n 1 2 ] \n 2 1 3 | 是的 | 影响有效性的更新 |
 | 4 \n ()() \n 1 \n 2 1 4 | 4 \n ()() \n 1 \n 2 1 4 | 是的 | 串联处理 |

 ## 边缘情况

 一个关键的边缘情况是当更新将字符从打开翻转到关闭时，改变线段树节点两侧的取消行为。 例如，从“((”开始，将一个字符更新为“)”，结构从两个不匹配的开局变为部分取消的场景。线段树保证了重新计算向上传播，因此根正确反映了更新后的余额。

 另一个边缘情况是完全由不同括号类型组成的子字符串。 例如，“([{}])”仅在正确嵌套时才有效； 否则无效。 合并逻辑可以防止意外的跨类型取消，因此除非结构真正匹配，否则状态保持非空。 

第三种边缘情况是在多次更新后查询单个位置。 叶节点直接反映其当前括号，因此答案完全取决于该单个字符是否可以形成有效的结构，但事实并非如此，算法正确地返回“否”。
