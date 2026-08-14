---
title: "CF 102348I - 广播电台"
description: "我们有 (p) 个广播电台。 选择站 (i) 意味着与其签订合同，并且只有当所选信号功率 (f) 位于其区间 ([li,ri]) 内时才有可能。 对于固定（f），其间隔之外的电台被迫保持未选择状态。"
date: "2026-08-13T01:06:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102348
codeforces_index: "I"
codeforces_contest_name: "ICPC 2019-2020 NERC (NEERC), Southern and Volga Russia Qualifier"
rating: 0
weight: 102348
solve_time_s: 362
verified: true
draft: false
---

[CF 102348I - 广播电台](https://codeforces.com/problemset/problem/102348/I)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (p) 个广播电台。 选择站 (i) 意味着与其签订合同，并且只有当所选信号功率 (f) 位于其区间 ([l_i,r_i]) 内时才有可能。 对于固定（f），其间隔之外的电台被迫保持未选择状态。 

每个投诉都会给出一对 ((x_i,y_i))，并要求至少选择这两个站点之一。 每个干扰对 ((u_i,v_i)) 最多需要选择这两个站之一。 任务是选择 (f) 和满足所有这些条件的一组站，或者报告不存在这样的选择。 官方的限制允许所有四个主要参数都达到(4\cdot10^5)，限制为7秒，内存为256 MB。 

仅就选站部分而言，这已经是一个 2-SAT 实例。 令(S_i) 表示选择站(i)。 投诉变为 (S_x\lor S_y)，而干扰对变为 (\lnot S_u\lor\lnot S_v)。 困难在于（f）事先并不知道，而选择（f）可能会迫使许多站出错。 

直接实现可以尝试每个 (f)，构造相应的 2-SAT 实例，并每次运行 SCC。 一项检查的成本为 (O(p+n+m))，因此所有 (M) 个选择的成本为 (O(M(p+n+m)))。 在最大限制下，这大约是 (4\cdot10^5\cdot1.2\cdot10^6=4.8\cdot10^{11}) 输入规模操作，远远超出了时间限制允许的范围。 

有几种边界情况很容易破坏实现。 间隔为 ([l,r]) 的站点在两个端点都可用，因此用 (l<f<r) 替换条件会默默地丢失有效答案。 例如，```
2 3 2 2
1 2
2 3
1 1
1 2
2 2
1 2
2 3
```具有有效答案 (f=2)，且仅选择了站 2。 站 2 恰好在其上端点可用，选择它可以满足这两个问题。 

当不同的投诉只能由互不相交的权力来处理时，就会出现另一种失败。 例如，```
2 4 2 2
1 2
3 4
1 1
1 1
2 2
2 2
1 2
3 4
```有答案`-1`。 在(f=1)时，只能选择站点1和站点2，因此不能满足第二个投诉。 在(f=2)时，只有站3和站4可用，因此不能满足第一个投诉。 仅检查选站公式是否可满足而不表示 (f) 将错误地接受此实例。 

第三个微妙的情况是信号功率本身必须由 1 到 (M) 之间的有效整数表示。 如果构造允许人工值 0 或 (M+1)，则它可以产生没有相应信号功率的布尔赋值。 下面的阈值结构明确地防止了这种情况。 

## 方法

 暴力解决方案在概念上很简单。 固定 (f) 的值，将间隔不包含 (f) 的每个站点标记为强制未选择，添加投诉和干扰条款，并使用强连接组件求解生成的 2-SAT 实例。 如果该公式可满足，则SCC分配给出所选择的站。 尝试所有 (M) 次幂是正确的，因为每个可能的答案都恰好使用其中之一。 

问题在于重复的 SCC 计算。 尽管单个 2-SAT 检查是线性的，但在最坏的情况下，将其乘以 (M) 会产生大约 (4.8\cdot10^{11}) 次运算。 大号 (M) 专门用于排除这种方法。 

关键的观察是我们实际上不需要枚举 (f)。 相反，将语句“(f) 至少是(t)”表示为另一个布尔变量。 就叫它吧（T_t）。 我们添加 (T_{t+1}\rightarrow T_t)，因此这些变量的真值必须形成真值前缀。 我们还强制 (T_1) 为 true，(T_{M+1}) 为 false。 因此，每个令人满意的分配都恰好包含一个截止值，并且该截止值是 (f) 的合法值。 

这使得站点间隔成为普通的 2-SAT 含义。 如果选择站(i)，则(f\ge l_i)，所以(S_i\rightarrow T_{l_i})。 还有 (f\le r_i)，它等价于 (f<r_i+1)，所以 (S_i\rightarrow\lnot T_{r_i+1})。 两者都是布尔文字之间的普通含义。 

因此，整个问题是一个具有 (p+M+1) 个布尔变量的 2-SAT 实例。 该结构只有 (O(n+p+m+M)) 个子句，并且可以通过一次 SCC 计算来解决。 这与此问题常用的前缀优化观点相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(M(p+n+m))) | (O(p+n+m)) | 太慢了 |
 | 最佳| (O(p+n+m+M)) | (O(p+n+m+M)) | 已接受 |

 ## 算法演练

1. 为每个站点创建一个布尔变量 (S_i)。 其真值表示站(i)被选择，其假值表示其未被选择。 用两个蕴涵图顶点表示每个布尔变量，一个代表文字，一个代表其否定。 
2. 将每个投诉 ((x,y)) 转换为子句 (S_x\lor S_y)。 在蕴涵图中，这给出了两条边 (\lnot S_x\rightarrow S_y) 和 (\lnot S_y\rightarrow S_x)。 这些边缘准确地表达了投诉可能被迫成立的两种方式。 
3. 将每个干扰对 ((u,v)) 转换为子句 (\lnot S_u\lor\lnot S_v)。 它的蕴含边是 (S_u\rightarrow\lnot S_v) 和 (S_v\rightarrow\lnot S_u)。 因此，选择任一端点都会强制取消选择另一个端点。 
4. 为从 1 到 (M+1) 的每个 (t) 引入一个布尔变量 (T_t)，其中预期含义为 (T_t=(f\ge t))。 为从 1 到 (M) 的每个 (t) 添加子句 (\lnot T_{t+1}\lor T_t)。 这些子句强制阈值变量是单调的。 
5. 强制 (T_1) 为 true，(T_{M+1}) 为 false。 由于阈值变量是单调的，因此真值和假值之间现在只有一个边界。 如果最大真实阈值是 (f)，则 (T_t) 对于 (t\le f) 精确为真，因此该布尔赋值表示整数信号功率 (f)。 
6. 对于每个站 (i)，添加 (S_i\rightarrow T_{l_i})。 如果选择站 (i)，则 (l_i) 的阈值必须为真，即 (f\ge l_i)。 
7. 对于每个站 (i)，添加 (S_i\rightarrow\lnot T_{r_i+1})。 由于 (T_{r_i+1}) 意味着 (f\ge r_i+1)，因此它的否定意味着 (f\le r_i)。 结合前面的含义，选择站 (i) 会强制 (l_i\le f\le r_i)。 
8. 根据所有这些子句构建蕴涵图，并使用 Tarjan 算法计算其强连通分量。 当某个变量及其否定属于同一个 SCC 时，2-SAT 实例是不可能的。 我们检查站变量和阈值变量。 
9. 如果公式可满足，则使用 SCC 顺序分配每个变量。 通过 Tarjan 的组件编号，组件按照逆拓扑顺序生成，因此组件编号较小的文字就是所选的真值。 对于一个站，当其真文字的组件编号小于其假文字的组件编号时，(S_i) 为真。 
10. 扫描(T_1,\ldots,T_M)并取选择真实文字的最大阈值。 单调性保证了这些真实的阈值形成一个前缀，因此这个最大的索引正是所需要的（f）。 输出 (S_i) 变量为 true 的每个站点。 

该结构背后的不变性是，阈值变量的每个令人满意的分配恰好对应于一个合法整数（f），而每个选定的站都被迫使其整个区间包含该（f）。 相反，（f）和站的任何有效选择都可以转换为满足每个构造子句的所有（S_i）和（T_t）的真值。 因此，当原始问题有答案时，构造的 2-SAT 实例就可以满足。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    input = sys.stdin.readline

    n, p, M, m = map(int, input().split())

    # Store complaints temporarily. Conflicts can be processed later.
    complaints = array('i')
    for _ in range(n):
        x, y = map(int, input().split())
        complaints.append(x - 1)
        complaints.append(y - 1)

    left = array('i')
    right = array('i')
    for _ in range(p):
        l, r = map(int, input().split())
        left.append(l)
        right.append(r)

    # Variables:
    #   0 .. p-1          : station variables
    #   p .. p+M          : threshold variables T_1 .. T_{M+1}
    variables = p + M + 1
    vertices = variables * 2

    # Store clauses as pairs of literal IDs.
    # Literal 2*v is v=True, literal 2*v+1 is v=False.
    clauses = array('i')

    # Complaint: S_x OR S_y
    for i in range(0, 2 * n, 2):
        x = complaints[i]
        y = complaints[i + 1]
        clauses.append(2 * x)
        clauses.append(2 * y)

    del complaints

    # Station interval:
    # S_i -> T_l
    # S_i -> !T_{r+1}
    for i in range(p):
        station_true = 2 * i

        tl_var = p + left[i] - 1
        tr1_var = p + right[i]

        clauses.append(station_true ^ 1)
        clauses.append(2 * tl_var)

        clauses.append(station_true ^ 1)
        clauses.append(2 * tr1_var + 1)

    del left
    del right

    # Conflict: !S_u OR !S_v
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        clauses.append(2 * u + 1)
        clauses.append(2 * v + 1)

    # T_{t+1} -> T_t
    # Equivalent to !T_{t+1} OR T_t.
    for t in range(1, M + 1):
        cur = p + t - 1
        nxt = cur + 1
        clauses.append(2 * nxt + 1)
        clauses.append(2 * cur)

    # T_1 must be true.
    t1 = p
    clauses.append(2 * t1)

    # T_{M+1} must be false.
    tm1 = p + M
    clauses.append(2 * tm1 + 1)

    # Build adjacency in CSR form.
    # For clause (a OR b):
    #   !a -> b
    #   !b -> a
    degree = array('i', [0]) * vertices

    clen = len(clauses)
    for i in range(0, clen, 2):
        a = clauses[i]
        b = clauses[i + 1]
        degree[a ^ 1] += 1
        degree[b ^ 1] += 1

    start = array('i', [0]) * (vertices + 1)
    total = 0
    for i in range(vertices):
        start[i] = total
        total += degree[i]
    start[vertices] = total

    edge = array('i', [0]) * total
    pos = array('i', start)

    for i in range(0, clen, 2):
        a = clauses[i]
        b = clauses[i + 1]

        u = a ^ 1
        idx = pos[u]
        edge[idx] = b
        pos[u] = idx + 1

        u = b ^ 1
        idx = pos[u]
        edge[idx] = a
        pos[u] = idx + 1

    del clauses
    del degree
    del pos

    # Iterative Tarjan SCC.
    #
    # Recursive Tarjan is unsafe here because the graph can have more
    # than 1.6 million vertices.
    dfn = array('i', [0]) * vertices
    low = array('i', [0]) * vertices
    comp = array('i', [0]) * vertices
    on_stack = bytearray(vertices)

    scc_stack = array('i')
    dfs_vertices = array('i')
    dfs_edges = array('i')

    timer = 0
    component_count = 0

    for root in range(vertices):
        if dfn[root]:
            continue

        timer += 1
        dfn[root] = timer
        low[root] = timer
        on_stack[root] = 1
        scc_stack.append(root)

        dfs_vertices.append(root)
        dfs_edges.append(start[root])

        while dfs_vertices:
            v = dfs_vertices[-1]
            e = dfs_edges[-1]

            if e < start[v + 1]:
                w = edge[e]
                dfs_edges[-1] = e + 1

                if dfn[w] == 0:
                    timer += 1
                    dfn[w] = timer
                    low[w] = timer
                    on_stack[w] = 1
                    scc_stack.append(w)

                    dfs_vertices.append(w)
                    dfs_edges.append(start[w])
                elif on_stack[w]:
                    dw = dfn[w]
                    if dw < low[v]:
                        low[v] = dw
            else:
                dfs_vertices.pop()
                dfs_edges.pop()

                if dfs_vertices:
                    parent = dfs_vertices[-1]
                    lv = low[v]
                    if lv < low[parent]:
                        low[parent] = lv

                if low[v] == dfn[v]:
                    component_count += 1
                    while True:
                        w = scc_stack.pop()
                        on_stack[w] = 0
                        comp[w] = component_count
                        if w == v:
                            break

    del dfn
    del low
    del on_stack
    del scc_stack
    del dfs_vertices
    del dfs_edges

    # Every variable must be different from its negation.
    for v in range(variables):
        if comp[2 * v] == comp[2 * v + 1]:
            print(-1)
            return

    # Tarjan numbers SCCs in reverse topological order.
    # Smaller component number means the literal is chosen.
    selected = []
    for i in range(p):
        if comp[2 * i] < comp[2 * i + 1]:
            selected.append(i + 1)

    # Recover f from the threshold variables.
    f = 1
    for t in range(1, M + 1):
        var = p + t - 1
        if comp[2 * var] < comp[2 * var + 1]:
            f = t

    print(len(selected), f)
    print(*selected)

if __name__ == "__main__":
    solve()
```实施的第一部分读取投诉和间隔。 投诉必须暂时存储，因为站间隔数据随后到来，而干扰对在间隔之后到达，可以直接转换为子句。 

每个布尔变量占用两个连续的文字ID。 偶数 ID 代表真实文字，奇数 ID 代表虚假文字，因此否定很简单`literal ^ 1`。 这使得蕴涵构造变得紧凑，并避免为文字存储单独的对象。 

该代码将所有 2-SAT 子句临时存储为`array('i')`。 普通的 Python 列表会消耗更多的内存，因为它的整数元素是 Python 对象。 同样的原因促使使用`array('i')`对于图和 SCC 数组。 

蕴涵图以 CSR 形式存储，而不是作为 Python 列表的列表。 这`start[v]`和`start[v+1]`范围恰好包含顶点的出边`v`。 这避免了数百万个 Python 列表对象，并将每个图索引保持在四个字节。 

SCC 计算是迭代 Tarjan。 递归DFS可以达到与图顶点数成正比的深度，这里可以超过160万个。 两个显式 DFS 堆栈保留了递归调用所保留的相同状态：当前顶点和仍需要检查的下一个传出边。 

间隔编码特意使用(r_i+1)。 上限条件是 (f\le r_i)，正好是 (\lnot(f\ge r_i+1))。 由于(r_i)可以等于(M)，因此额外的阈值(T_{M+1})是必要的。 它被强制为假，因此具有 (r_i=M) 的站接收到正确的无限制上限。 

Python 中没有整数可以溢出，每个图索引最多约为 160 万个，这也很适合实现所使用的四字节数组。 

## 工作示例

 对于样本 1，请考虑使用 (f=3) 并选择站 1 和 3 的有效分配。 阈值变量将 (f=3) 描述为 (T_1=T_2=T_3=\text{true}) 和 (T_4=\text{false})。 

| 舞台| 状态|
 | --- | --- |
 | 信号功率| (f=3) |
 | (T_1,T_2,T_3,T_4) | 真，真，真，假|
 | 精选电台 | 1, 3 |
 | 站1间隔| ([1,4])，有效 |
 | 站3间隔| ([3,4])，有效 |
 | 投诉 ((1,3)) | 1号或3号站满意|
 | 投诉 ((2,3)) | 3站满意|
 | 冲突 ((1,4)) | 站 4 未选择 |
 | 冲突 ((3,4)) | 站 4 未选择 |
 | 结果 | 有效 |

 SCC 作业可能会选择不同的令人满意的作业，因为该问题允许任意答案。 重要的是选定的阈值变量形成一个前缀，并且每个选定的站点都与最终的截止值兼容。 

对于示例 2，站 1 和 2 仅适用于功率 1 和 2，而站 3 和 4 仅适用于功率 3 和 4。 

| 信号功率| 可用车站 | 第一次投诉 | 第二次投诉| 冲突| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1, 2 | 需要 1 或 2 | 需要 2 或 4，所以 2 | 1 和 2 不能同时选择 | 不可能|
 | 2 | 1, 2 | 需要 1 或 2 | 需要 2 或 4，所以 2 | 1 和 2 不能同时选择 | 不可能|
 | 3 | 3, 4 | 需要 1 或 3，所以 3 | 需要 2 或 4，所以 4 | 3 和 4 不能同时选择 | 不可能|
 | 4 | 3, 4 | 需要 1 或 3，所以 3 | 需要 2 或 4，所以 4 | 3 和 4 不能同时选择 | 不可能|

 阈值公式表示一个 2-SAT 实例中的所有四种可能性，而不是重建公式四次。 SCC计算发现所需选择与干扰子句之间的矛盾，因此程序打印`-1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+p+m+M)) | 有 (O(n+p+m+M)) 个子句和顶点，Tarjan 对每个顶点和蕴涵边检查一次。 |
 | 空间| (O(n+p+m+M)) | 临时子句、CSR 图、SCC 数组和输入间隔在输入大小上都是线性的。 |

 在最大约束下，最多有大约 (8\cdot10^5) 个布尔变量和大约 (4\cdot10^6) 个蕴涵边。 该实现使用打包的四字节整数数组和迭代 SCC 遍历，从而使内存大大低于 256 MB 的限制。 线性构造和 SCC 通道用几百万次图操作取代了强力 (4.8\cdot10^{11}) 规模的工作。 

## 测试用例

 由于输出不是唯一的，因此精确的字符串比较不适用于这些测试。 下面的测试工具检查返回的解决方案在语义上是否有效。 最大尺寸测试仅检查求解器是否找到解决方案，因为完全解析和独立验证数十万行将使测试工具本身变得不必要的昂贵。```python
# Assume the submitted solution is saved as solution.py.
# Its solve() function reads stdin and writes stdout.

import sys
import io
from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str, possible: bool):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    p = next(it)
    M = next(it)
    m = next(it)

    complaints = []
    for _ in range(n):
        complaints.append((next(it), next(it)))

    intervals = []
    for _ in range(p):
        intervals.append((next(it), next(it)))

    conflicts = []
    for _ in range(m):
        conflicts.append((next(it), next(it)))

    out = out.strip()

    if not possible:
        assert out == "-1"
        return

    tokens = list(map(int, out.split()))
    assert len(tokens) >= 2

    k, f = tokens[0], tokens[1]
    chosen = tokens[2:]

    assert 1 <= f <= M
    assert k == len(chosen)
    assert len(set(chosen)) == k
    assert all(1 <= x <= p for x in chosen)

    chosen_set = set(chosen)

    for x, y in complaints:
        assert x in chosen_set or y in chosen_set

    for u, v in conflicts:
        assert not (u in chosen_set and v in chosen_set)

    for x in chosen:
        l, r = intervals[x - 1]
        assert l <= f <= r

# Provided sample 1
sample1 = """\
2 4 4 2
1 3
2 3
1 4
1 2
3 4
1 4
1 2
3 4
"""
validate(sample1, run(sample1), True)

# Provided sample 2
sample2 = """\
2 4 4 2
1 3
2 4
1 2
1 2
3 4
3 4
1 2
3 4
"""
validate(sample2, run(sample2), False)

# Minimum feasible size under the distinct-pair condition.
case_min = """\
2 3 2 2
1 2
2 3
1 1
1 2
2 2
1 2
2 3
"""
validate(case_min, run(case_min), True)

# All intervals are equal, so the signal power is unrestricted inside [1, 2].
case_equal = """\
2 4 2 2
1 2
3 4
1 2
1 2
1 2
1 2
1 2
3 4
"""
validate(case_equal, run(case_equal), True)

# The two complaints require disjoint signal ranges.
case_impossible = """\
2 4 2 2
1 2
3 4
1 1
1 1
2 2
2 2
1 2
3 4
"""
validate(case_impossible, run(case_impossible), False)

# Endpoint test: station 2 is usable at both l=1 and r=2,
# and f=2 gives a valid solution using only station 2.
case_endpoint = """\
2 3 2 2
1 2
2 3
1 1
1 2
2 2
1 2
2 3
"""
validate(case_endpoint, run(case_endpoint), True)

# Maximum-size stress test.
# An even cycle is both the complaint graph and the conflict graph.
# Every interval is [1, M], so an alternating selection is valid.
N = 400000
P = 400000
MM = 400000
E = 400000

parts = [f"{N} {P} {MM} {E}\n"]

for i in range(1, N):
    parts.append(f"{i} {i + 1}\n")
parts.append(f"1 {N}\n")

parts.extend(["1 400000\n"] * P)

for i in range(1, N):
    parts.append(f"{i} {i + 1}\n")
parts.append(f"1 {N}\n")

maximum_case = "".join(parts)
assert not run(maximum_case).startswith("-1")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 任何有效的作业 | 不同站点间隔的基本可满足实例|
 | 样品2 |`-1`| 投诉、冲突和不相交频率范围之间的相互作用 |
 |`case_min`| 任何有效的作业 | 不同对要求下的最小实际有效配置 |
 |`case_equal`| 任何有效的作业 | 所有间隔均相等且可能有多个信号功率 |
 |`case_impossible`|`-1`| 需要相互分开的频率范围的投诉|
 |`case_endpoint`| 任何有效的赋值，（f=2）可能 | 包含区间下限和上限 |
 |`maximum_case`| 任何有效的作业 | 所有四个主要输入参数的最大值和内存压力 |

 ## 边缘情况

 包含端点情况由上蕴涵处理（S_i\rightarrow\lnot T_{r_i+1}）。 在`case_endpoint`，站 2 有区间 ([1,2])。 当 SCC 分配选择 (T_2=\text{true}) 和 (T_3=\text{false}) 时，允许站 2，因为所需的不等式是 (f\ge1) 和 (f<3)，给出 (f\le2)。 该算法因此可以返回站 2 (f=2)。 

处理不相交频率的情况是因为阈值变量是全局的而不是独立测试的。 在`case_impossible`，从第一抱怨力量中选择一个站（f=1），同时从第二抱怨力量中选择一个站（f=2）。 阈值子句使这些要求成为同一布尔系统的一部分，由此产生的矛盾将变量及其否定置于同一 SCC 中。 算法返回`-1`。 

允许功率范围的边界受到强制变量 (T_1=\text{true}) 和 (T_{M+1}=\text{false}) 的保护。 对于对应于 (f=0) 的假设分配，(T_1) 必须为假，这与第一个单元子句相矛盾。 对于对应于 (f=M+1) 的赋值，(T_{M+1}) 必须为真，这与第二个单元子句相矛盾。 因此，每个幸存的阈值分配都对应于一些 (f\in[1,M])。 

最后，该算法不假设干扰关系是传递的。 每个列出的对都贡献了一个“不同时选择”子句。 如果站 1 与站 2 冲突，站 2 与站 3 冲突，则该构造不会造成站 1 和站 3 之间的冲突。这与输入中的图表相匹配，并防止出现常见错误，即干扰对被错误地视为连接的分量。
