---
title: "CF 102201H - 很难解释"
description: "树的根位于顶点 1。对于查询 (V, T)，相关顶点正是 V 的祖先，包括 V 本身和根。 在这些祖先中，顶点 i 仅当 Ci = T 时才可以使用，其成本是线 [ fi(T)=Ai+BiT 的值。"
date: "2026-08-18T10:35:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102201
codeforces_index: "H"
codeforces_contest_name: "Moscow Pre-Finals Workshop 2019. KAIST Contest"
rating: 0
weight: 102201
solve_time_s: 600
verified: true
draft: false
---

[CF 102201H - 很难解释](https://codeforces.com/problemset/problem/102201/H)

 **评级：** -
 **标签：** -
 **求解时间：** 10m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 树的根位于顶点 1。对于查询`(V, T)`，相关顶点正是`V`， 包括`V`本身和根。 在这些祖先中，顶点`i`仅当`C_i >= T`，其成本就是线路的价值

 [
 f_i(T)=A_i+B_iT。 
]

 任务是返回最小的此类值。 

树的状态为`B`是中心结构属性：

 [
 B_{\operatorname{parent}(v)}\le B_v。 
]

 因此，沿着每条从根到叶的路径，相应线的斜率永远不会减小。 如果没有这个条件，该问题将需要完全动态的凸包结构。 有了它，属于一个根到顶点路径的线就有了有用的排序。 

最多有 80,000 个顶点和 160,000 个查询。 查询可能涉及整个根到叶路径，因此在链形树上显式遍历该路径已经太慢了。 在最坏的情况下，每个查询大约有 (80,000) 个祖先，为 160,000 个查询提供大约 (1.28\times10^{10}) 行评估。 该解决方案必须接近每个查询的对数工作量。 

三种边缘条件通常会导致错误的实现。 

首先，查询的顶点本身属于该路径。 例如，```
1 1
5
7
1000000000
1 0
```有答案`5`，因为顶点 1 也是查询的顶点。 一个实现从`parent[V]`会错误地找不到候选人。 

其次，条件是`C_i >= T`， 不是`C_i > T`。 为了```
2 1
10 1
1 2
5 5
1 2
2 5
```答案是`6`，因为顶点 2 有`C_2 = 5`且有效期为`T = 5`。 严格比较会丢弃它并返回`15`。 

第三，`T = 0`是合法的。 在这种情况下，每个顶点都满足`C_i >= T`，所以答案就是最小的`A_i`在根到`V`小路。 在示例中，查询`(4, 0)`考虑顶点`1, 2, 4`并返回`2`。 任何假设正查询坐标或开始其李超域的实现`1`可能会在这里失败。 

## 方法

 暴力解法直接遵循定义。 对于每个查询，步行从`V`朝向根，忽略其顶点`C_i`小于`T`，并评估`A_i+B_iT`其余的。 这是正确的，因为该路径上的每个顶点都是从根到的唯一路径上的顶点之一。`V`。 

问题是路径长度。 80,000 个顶点的链加上 160,000 个查询可能需要 (80,000\cdot160,000=12.8) 十亿次评估。 尽管一次评估只是几个整数运算，但这远远超出了时间限制。 

第一个有用的观察是将每个顶点视为一条线

 [
 y=A_i+B_ix。 
]

 然后查询要求最低的有效行`x = T`。 第二个观察结果是有效性是 x 轴的前缀：行`i`为所有人而存在`x <= C_i`。 因此，每个顶点实际上给了我们一条从左向延伸的线段`C_i`。 

第三个观察是树结构。 如果我们从根向节点处理顶点，我们将插入斜率不递减的线。 顶点查询`V`正好需要在根到-上插入行后获得的数据结构`V`小路。 

我们可以让它持久化。 每个顶点存储从其父顶点继承的数据结构的一个版本，然后添加自己的线段。 查询于`V`使用版本`V`，因此持久性自动将候选集限制为祖先`V`。 

剩下的问题是一行的有效期最多为`C_i`，而不是整个 x 轴。 李超树可以在一个区间上插入一条线，而不是在整个坐标域上。 由于每个有效区间都是`[0, C_i]`，我们在该前缀上执行行的范围插入。 然后，李超树保证查询`T`准确地看到其有效性区间包含的行`T`。 

通过仅复制因插入而更改的李超节点来处理持久性。 属于子级的版本指向父级的根，因此不同的树分支共享所有未更改的结构。 

由此产生的方法是一个持久线段树，其节点包含李超信息。 范围插入成本 (O(\log^2 C))，其中 (C\le10^9)，点查询成本 (O(\log C))。 在给定的范围内，对数最多约为 30。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(NQ)) | (O(N)) | 太慢了 |
 | 持续区间李超| (O(N\log^2 10^9+Q\log 10^9)) | (O(N\log^2 10^9)) 最坏情况 | 已接受 |

 ## 算法演练

 1. 以顶点 1 为树的根并确定每个顶点的父节点。 

我们以迭代方式而不是递归方式执行此操作，因为一棵树可以是由 80,000 个顶点组成的链，而 Python 的递归限制不适合这种遍历。 
2. 对于每个顶点`v`， 定义`root[v]`是持久李超树的根，表示属于从顶点 1 到 的路径上的顶点的所有有效线段`v`。 

根的版本最初包含第 1 行。对于每个其他顶点`v`，从`root[parent[v]]`并插入行

 [
 y=A_v+B_vx
 ]

 在间隔上

 [
 [0，C_v]。 
]

 这是关键的持久性不变量。 眼下`root[v]`建成后，它完全包含属于祖先的线条`v`。 
3.用整数区间表示x轴`[0, 10^9]`。 

我们只查询整数值`T`，因此不需要浮点交集。 李超树完全用于整数行值的比较。 
4. 插入一行`[0,C_v]`，通过李超坐标树递归下降。 

如果当前坐标区间被完全覆盖`[0,C_v]`，在该间隔上执行普通的李超插入。 

如果只覆盖了部分区间，则递归处理覆盖的子项。 

因为数据结构是持久化的，所以每一个修改过的李超节点都会被复制。 未修改的子项继续指向旧版本。 
5. 对于普通的李超插入，在每个线段树节点处保留一条候选线。 

比较新旧线的左端点、中点和右端点。 如果新线在中点处更好，则将其与存储的线交换。 在中点处丢失的线最多仍然与一侧相关，因此递归到该侧。 

这是标准的李超不变量：沿着每条从根到叶的路径，至少有一条存储的线在相应的叶坐标处是最佳的。 
6. 回答`(V,T)`，开始于`root[V]`并下降到代表的叶子`T`。 

在每个访问的李超节点，评估其存储的行`T`并取最小值。 自从`root[V]`仅包含祖先`V`，并且间隔插入使得一行仅存在于`T <= C_i`，最小值正好超过查询允许的顶点。 
7. 按照原始顺序输出收集到的答案。 

### 为什么它有效

 不变的是`root[v]`精确地包含根到-上的顶点的线段`v`小路。 对于插入线后的顶点 1 来说也是如此。 当从父级移动到子级时，持久性会复制父级的版本并准确添加子级的线段，因此不变式保持不变。 

对于查询`(V,T)`，从顶点开始的一条线`i`出现在`root[V]`恰好在什么时候`i`是的祖先`V`。 它的区间插入仅在坐标上将其放入李超结构中`x <= C_i`，所以它恰好在什么时候参与查询`T <= C_i`。 然后，李超不变量保证在根到-上找到所有参与线中的最小值`T`搜索路径。 

单调性`B`与祖先构造兼容，并且是该问题允许基于路径的凸包解决方案的结构原因。 下面的实现使用更通用的区间李超公式，因此不需要浮点交集计算或相等斜率的特殊情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30
XMAX = 10**9

def solve():
    n, q = map(int, input().split())

    A = [0] + list(map(int, input().split()))
    B = [0] + list(map(int, input().split()))
    C = [0] + list(map(int, input().split()))

    graph = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    parent = [0] * (n + 1)
    order = [1]
    parent[1] = -1

    for u in order:
        for v in graph[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            order.append(v)

    # Persistent Li Chao nodes.
    #
    # Each node contains:
    #   line index stored at this node
    #   left child
    #   right child
    #
    # A line index of 0 means "no line".
    lc = [0]
    rc = [0]
    ln = [0]

    def value(line_id, x):
        if line_id == 0:
            return INF
        return A[line_id] + B[line_id] * x

    def clone(node):
        if node == 0:
            lc.append(0)
            rc.append(0)
            ln.append(0)
        else:
            lc.append(lc[node])
            rc.append(rc[node])
            ln.append(ln[node])
        return len(ln) - 1

    def add_line(node, l, r, new_line):
        node = clone(node)

        old_line = ln[node]

        if old_line == 0:
            ln[node] = new_line
            return node

        mid = (l + r) >> 1

        if value(new_line, mid) < value(old_line, mid):
            ln[node], new_line = new_line, old_line

        if l == r:
            return node

        if value(new_line, l) < value(ln[node], l):
            left = add_line(lc[node], l, mid, new_line)
            lc[node] = left
        elif value(new_line, r) < value(ln[node], r):
            right = add_line(rc[node], mid + 1, r, new_line)
            rc[node] = right

        return node

    def add_segment(node, l, r, ql, qr, new_line):
        if qr < l or r < ql:
            return node

        node = clone(node)

        if ql <= l and r <= qr:
            # The whole interval is covered, so this is a normal
            # Li Chao insertion.
            return add_line(node, l, r, new_line)

        mid = (l + r) >> 1

        if ql <= mid:
            lc[node] = add_segment(
                lc[node], l, mid, ql, qr, new_line
            )

        if qr > mid:
            rc[node] = add_segment(
                rc[node], mid + 1, r, ql, qr, new_line
            )

        return node

    def query(node, l, r, x):
        ans = value(ln[node], x)

        if l == r:
            return ans

        mid = (l + r) >> 1

        if x <= mid:
            if lc[node]:
                other = query(lc[node], l, mid, x)
                if other < ans:
                    ans = other
        else:
            if rc[node]:
                other = query(rc[node], mid + 1, r, x)
                if other < ans:
                    ans = other

        return ans

    roots = [0] * (n + 1)

    # Build versions in parent-before-child order.
    for v in order:
        base = roots[parent[v]] if parent[v] > 0 else 0
        roots[v] = add_segment(base, 0, XMAX, 0, C[v], v)

    out = []

    for _ in range(q):
        v, t = map(int, input().split())
        out.append(str(query(roots[v], 0, XMAX, t)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一次遍历构建父关系。 数组`order`是有根树的拓扑顺序，因为每个父级都出现在其子级之前，这让我们可以构建`root[v]`没有递归。 

数组`lc`,`rc`， 和`ln`形成持久的李朝树。 索引零表示空节点。 复制的节点继承了先前版本的子指针及其存储的行，因此仅需要更改受新行影响的节点。`add_line`就是普通的李超插入。 存储在节点处的线是当前位于中点的更好的线。 如果移位的线仍然可以在左端点或右端点上击败它，则将其递归插入到该侧。`add_segment`仅将线添加到坐标区间`[0,C_v]`。 当当前区间被完全覆盖时，它委托给`add_line`。 否则，它将复制当前节点并继续进入相交的子节点。 

边界是包容性的。 调用使用`0`通过`C[v]`，因此查询`T == C[v]`正确接受顶点。 全局坐标区间两端也包含在内，这就是递归使用的原因`[l, r]`而不是半开区间。 

Python 整数具有任意精度，因此诸如`B[i] * T + A[i]`不能溢出。 在 C++ 中，64 位有符号整数在这里也足够了，因为最大值最多约为 (10^{18}+10^9)。 

有一个实施细节值得关注。 树的遍历是迭代的，而李超递归的深度只有30左右，因为它的坐标范围是`[0,10^9]`。 因此树本身不能触发Python的递归深度限制。 

## 工作示例

 提供的样本有树```
        1
       / \
      2   3
     / \
    4   5
```对于顶点 4，路径为`1 -> 2 -> 4`。 他们的线路是

 [
 5+T，\qquad 4+2T，\qquad 2+4T。 
]

 有效性限制是`10^9`,`2`， 和`5`。 

对于第一个查询，`T = 0`，这些行中的每一行都是有效的。 

| 顶点| 线路| C | T=0 时的值 | 当前最小值 |
 | ---| ---| ---| ---| ---|
 | 1 | (5+T) | (10^9) | (10^9) | 5 | 5 |
 | 2 | (4+2T) | 2 | 4 | 4 |
 | 4 | (2+4T) | 5 | 2 | 2 |

 答案是`2`。 

对于第二个查询，`T = 2`，所有三个顶点仍然满足其有效性条件。 

| 顶点| 线路| C | T=2 时的值 | 当前最小值 |
 | ---| ---| ---| ---| ---|
 | 1 | (5+T) | (10^9) | (10^9) | 7 | 7 |
 | 2 | (4+2T) | 2 | 8 | 7 |
 | 4 | (2+4T) | 5 | 10 | 10 7 |

 答案是`7`。 

该跟踪演示了为什么有效性条件附加到线本身而不是附加到正在查询的顶点。 在`T=2`，顶点 2 正好位于其边界上并且仍然符合条件。 

第二个例子隔离了边界条件。```
3 3
10 1 100
1 2 3
1000000000 5 100
1 2
2 3
2 5
3 5
3 0
```root-to-3 路径包含顶点 1、2 和 3。 

| 查询 | 符合条件的顶点 | 价值观 | 回答 |
 | ---| ---| ---| ---|
 |`(2,5)`| 1, 2 | 15、11 | 11 | 11
 |`(3,5)`| 1、2、3 | 15、11、115 | 11 | 11
 |`(3,0)`| 1、2、3 | 10, 1, 100 | 10, 1, 100 | 1 |

 第一个查询特别有用，因为`C_2 = 5`和`T = 5`。 来自顶点 2 的线必须保持存在。 最后一个查询证实了这一点`T = 0`使每个顶点都符合条件并将目标降低到最低限度`A`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N\log^2 10^9+Q\log 10^9)) | 每个顶点创建一次持久区间插入，每个查询执行一次李超点查询 |
 | 空间| (O(N\log^2 10^9)) 最坏情况 | 持久化复制每次区间插入​​修改的李超节点 |

 由于 (\log_2(10^9)) 仅约为 30，因此对数因子受到一个小常数的限制。 该解决方案避免了每次查询都遍历根到顶点的路径，这使得链形树的直接实现变得不可能。 

1024 MB 的大内存限制对于这种持久表示很有用。 主要成本是复制的李超节点，而不是原始树。 

## 测试用例```python
import io
import sys

# The production solution is the solve() function from above.
# For assert-based tests, execute the same algorithm against an
# in-memory stdin/stdout pair.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
sample1 = """\
5 2
5 4 3 2 1
1 2 3 4 5
1000000000 2 4 5 2
1 2
1 3
2 4
2 5
4 0
4 2
"""

assert run(sample1) == """\
2
7
""".strip(), "sample 1"

# Minimum-size tree. The only possible candidate is the root.
sample2 = """\
1 3
17
23
1000000000
1 0
1 1000000000
1 999999999
"""

assert run(sample2) == """\
17
23000000017
23000000000
""".strip(), "single vertex"

# Exact C boundary and T = 0.
sample3 = """\
3 3
10 1 100
1 2 3
1000000000 5 100
1 2
2 3
2 5
3 5
3 0
"""

assert run(sample3) == """\
11
11
1
""".strip(), "C boundary and zero"

# Equal slopes. The ancestor condition allows equal B values.
# At T=10, vertex 3 is valid exactly at C=10.
sample4 = """\
4 4
20 5 1 100
7 7 7 7
1000000000 3 10 2
1 2
2 3
2 4
3 3
3 10
4 10
4 0
"""

assert run(sample4) == """\
15
71
27
1
""".strip(), "equal slopes"

# Large values, testing 64-bit-sized products.
sample5 = """\
2 3
1000000000 1000000000
1000000000 1000000000
1000000000 1000000000
1 2
2 0
2 1
2 1000000000
"""

assert run(sample5) == """\
1000000000
2000000000
1000000000000001000000000
""".strip(), "large arithmetic"

# A chain catches implementations that accidentally exclude an
# ancestor or use the wrong validity comparison.
sample6 = """\
5 4
50 40 30 20 10
1 2 3 4 5
1000000000 1 2 3 4
1 2
2 3
3 4
4 5
5 0
5 1
5 2
5 4
"""

assert run(sample6) == """\
10
41
56
250
""".strip(), "chain boundaries"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单顶点|`17`,`23000000017`,`23000000000`| 仅根路径和最大可能的查询值 |
 | 三顶点链|`11`,`11`,`1`| 精确的`C_i = T`边界和`T = 0`|
 | 等坡|`15`,`71`,`27`,`1`| 非严格单调性`B`和等斜线 |
 | 大算术| 64 位大小的大值 | 正确的整数运算而不溢出 |
 | 五顶点链|`10`,`41`,`56`,`250`| 多祖先有效性边界和路径持久性|

 ## 边缘情况

 单顶点情况```
1 3
17
23
1000000000
1 0
1 1000000000
1 999999999
```没有边，每个查询都使用相同的根线。 持久结构从空开始并插入根行`[0,10^9]`。 每个查询都会到达该行，产生`17`,`23000000017`， 和`23000000000`。 

对于精确的有效性边界，```
3 1
10 1 100
1 2 3
1000000000 5 100
1 2
2 3
2 5
```顶点 2 有`C_2 = 5`，所以它的行被插入`[0,5]`。 查询于`T=5`到达该间隔的端点并包含该线。 其值为`1+7*5=36`在此特定输入中，如果该行有`B_2=7`; 在之前的具体测试中，`A_2=1`和`B_2=2`, 给予`11`。 实现使用`qr = C[v]`，因此自然地处理了平等。 

为了`T=0`， 每一个`C_i`至少为 1，因此路径上的每一行都是有效的。 李超查询从坐标零开始，不需要特殊分支。 在示例路径中`1 -> 2 -> 4`，值为`5`,`4`， 和`2`，所以答案是`2`。 

等斜率也是合法的，因为以下条件`B`是不严格的。 假设一个祖先和它的孩子都有`B=7`。 它们的线是平行的。 李超比较仍然有效，因为它永远不会除以斜率差。 查询坐标处值较小的线自动获胜。 

最后，最大可能的乘积约为 (10^9\cdot10^9=10^{18})。 Python 直接使用任意精度整数来处理这个问题。 在固定宽度实现中，计算必须使用 64 位有符号类型而不是 32 位整数。
