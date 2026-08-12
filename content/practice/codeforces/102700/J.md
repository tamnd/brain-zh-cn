---
title: "CF 102700J - Java 考试"
description: "每个学生都准确地指出了一位最喜欢的伙伴。 如果我们从一个学生到他们最喜欢的伙伴之间画一条边，反对称​​条件意味着不存在涉及两个不同学生的有向循环。"
date: "2026-08-10T05:58:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102700
codeforces_index: "J"
codeforces_contest_name: "2020 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102700
solve_time_s: 451
verified: true
draft: false
---

[CF 102700J - Java 考试](https://codeforces.com/problemset/problem/102700/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个学生都准确地指出了一位最喜欢的伙伴。 如果我们从一个学生到他们最喜欢的伙伴之间画一条边，反对称​​条件意味着不存在涉及两个不同学生的有向循环。 允许自循环，因此该结构是有根树的集合，其中以下最喜欢的伙伴从节点移动到其根。 

当第一个学生从第二个学生开始位于最喜欢的伙伴链上时，一个学生就是另一个学生的特殊伙伴。 在树的语言中，特殊的伙伴就是祖先。 因此，组条件具有清晰的树解释。 

假设我们需要包含学生 (X) 和 (Y) 的最小有效组。 令 (L) 为它们的最低共同祖先。 该组必须包含从 (L) 到 (X) 的路径上的每个顶点以及从 (L) 到 (Y) 的路径上的每个顶点。 相反，路径的并集本身就是一个有效的组：每个非 (L) 顶点在组内都有其最喜欢的伙伴，而 (L) 是每个成员的祖先。 因此最小的组正是 (X) 和 (Y) 之间的树路径。 

动态课堂带来了一个复杂情况。 学生可能会离开，或者家长可能会稍后到达。 查询只能使用查询时在场的学生。 即使所需路径上有一个顶点不存在，也无法形成该组。 

对于每个学生，存储该学生上课的时间间隔。 最初在场的学生的开始时间为 (0)。 到达事件 (t) 的学生有开始时间 (t)，在事件 (t) 离开的学生有结束时间 (t)。 如果学生从未离开，则结束时间可以视为无限。 学生在查询时间 (t) 恰好在场

 [
 开始[v] \le t < 结束[v]。 
]

 因此，路径上的每个顶点都出现在时间 (t)，此时该路径上的最大开始时间最多为 (t)，并且最小结束时间大于 (t)。 

等级具有类似有用的表示形式。 为了保证主题正确，无论老师选择哪个小组成员，小组中的每个学生都必须知道该主题。 因此，最低等级是路径上每个顶点共有的主题数量。 如果学生已知的主题由位掩码表示，则答案只是路径上所有掩码的按位与，后跟 popcount。 

输入可以包含 (10^5) 个最初在场的学生和 (10^5) 个事件，而学生标识符是最多 (10^9) 个任意整数。 出现在任何地方的不同标识符的总数可以与输入大小成线性关系，因此需要进行坐标压缩。 由于有两秒的限制，为每个查询扫描整个树是不可行的。 最坏情况下的 (10^5) 个顶点链和 (10^5) 个查询将需要大约 (10^{10}) 个顶点访问。 我们需要每个查询的对数或接近对数的工作。 

有几种边缘情况很容易破坏原本合理的实现。 

### 被查询的两个同学是一样的

 单身团体是有效的，因为学生本身就是一个特殊的伙伴。 例如，```
1 1
1 1
1 1
1
1 1 1
```有输出```
1
```坚持找到两个不同顶点或假设路径至少有一条边的解决方案在这里会失败。 

### 两个学生在不同的树上

 考虑```
2 1
1 1
1 1
2 2
1 1
1
1 1 2
```这两个学生有不同的根源，因此没有共同的祖先，也没有包含两者的有效群体。 输出是```
-1
```假设整个图是一棵树的粗心 LCA 实现可能会返回任意根并产生无意义的路径。 

### 所需的中级学生已离开

 考虑```
3 2
1 2
2 1 2
2 3
2 1 2
3 3
2 1 2
3
1 1 3
0 2
1 1 3
```第一个查询使用路径(1,2,3)，因此其等级为(2)。 学生（2）随后离开。 第二个查询仍然需要相同的树路径，但是学生（2）不存在，所以它的答案是```
2
-1
```仅检查 (X) 和 (Y) 是否存在是不够的。 

### 父级可以在子级之后到达

 考虑```
1 1
1 2
1 1
3
1 1 2
2 2 2
1 1 2
```最初学生 (1) 指向学生 (2)，但学生 (2) 不在课堂上。 第一个查询是不可能的。 学生 (2) 到达后，路径变得可用，第二个查询返回 (1)。 

这就是为什么必须根据完整的事件历史记录而不是仅根据最初在场的学生来构建树的原因。 

## 方法

 直接的解决方案是将最喜爱的伙伴关系视为森林，并通过从 (X) 和 (Y) 走向它们的共同祖先来回答每个查询。 一旦知道路径，我们就可以检查所有顶点是否都存在以及它们的主题掩码。 

这种蛮力方法是正确的，因为最小的组正是两个学生之间的路径。 它的问题是路径长度。 一连串 (10^5) 个学生可以使单个查询完成 (O(10^5)) 工作。 对于 (10^5) 次查询，在最坏的情况下会变成 (10^{10}) 次操作，远远超出时间限制。 

有用的观察是，学生在课堂上实际上并没有改变他们在森林中的位置。 只是他们的可用性发生了变化。 由于每个学生最多到达一次，最多离开一次，因此我们可以首先读取整个事件序列，并为每个学生分配固定的活动间隔。 那么下面的森林就完全静止了。 

这会将动态部分转换为附加到每个顶点的三个静态值：其主题掩码、其到达时间和其离开时间。 路径聚合只需要三个关联操作：

 [
 掩码 = mask_1 \mathbin{&} mask_2,
 ]

 [
 最新开始 = \max(start_1,start_2),
 ]

 [
 最早结束 = \min(end_1,end_2)。 
]

 我们可以使用重轻分解来回答这些路径聚合。 树路径按照从重到轻的顺序变为 (O(\log N)) 个连续间隔，并且可以使用迭代线段树在 (O(\log N)) 中查询每个间隔。 生成的查询复杂度为 (O(\log^2 N))。 

重要的简化是没有线段树更新。 在构建树形数据结构之前，所有出发和到达都已转换为固定间隔。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((N+Q)N)) 最坏情况 | (O(N)) | 太慢了|
 | 最佳 | (O((N+Q)\log N + Q\log^2 N)) | (O(N+Q)) | 已接受 |

 ## 算法演练

 1. 阅读每一个最初的学生和每一个事件。 将每个学生标识符压缩为整数索引。 当学生首次仅作为最喜欢的伙伴或查询端点出现时，为他们创建一个占位符顶点。 

占位符代表可能永远不会真正到达的学生。 它的默认间隔是空的，因此任何需要它的路径都会自动变得无效。 
2. 存储每个顶点最喜欢的伙伴。 最喜欢的伙伴是其自身的顶点是根。 如果最喜欢的伙伴出现在输入中但从未成为学生，则它仍然是不活动的根。 

反对称条件保证生成的有向图没有非平凡环，因此这些组件是有根树。 
3. 将课堂活动转化为固定的可用时间间隔。 最初在场的学生收到`start = 0`。 到达事件 (t) 的学生收到`start = t`。 事件 (t) 处出发`end = t`。 从未离开的学生会收到有效无限的结束时间，而从未到达的学生则保持有效无限的开始时间和零结束时间。 

对于时间 (t) 的查询，当路径的最大开始时间至多 (t) 且最小结束时间大于 (t) 时，路径完全存在。 
4. 构建森林表示并计算每个顶点的深度、子树大小和重子树。 

重孩子是具有最大子树的孩子。 跟随重子节点会创建链，使得任何根到节点的路径仅穿过 (O(\log N)) 链。 
5. 执行重轻分解并为每个顶点分配线性数组中的一个位置。 在其位置存储其主题掩码、开始时间和结束时间。 
6. 在此数组上构建迭代线段树。 每个段存储三个聚合：所有主题掩码的 AND、最大开始时间和最短结束时间。 

单位元是 AND 的全一掩码，负无穷大表示最大值，正无穷大表示最小值。 
7. 对于涉及(X)和(Y)的查询，首先检查它们是否属于同一棵树。 如果他们不这样做，请回答`-1`。 
8. 将 (X) 和 (Y) 之间的路径分解为重光区间。 始终处理链头较深的端点，查询该链段，并将端点移动到其链头的父级。 

每个处理的间隔将其掩码、最大开始时间和最小结束时间贡献给路径聚合。 
9. 一旦两个顶点都在同一条重链上，查询它们位置之间的最终间隔。 该区间恰好包含一次最低共同祖先。 
10. 令结果路径聚合为`(commonMask, latestStart, earliestEnd)`。 如果`latestStart > queryTime`或者`earliestEnd <= queryTime`，至少有一名所需学生缺席，因此输出`-1`。 
11. 否则，最小有效组存在并且`commonMask`完全包含该组中每个成员都知道的主题。 答案是`commonMask.bit_count()`。 

### 为什么它有效

 最喜欢的伙伴关系使每个组件成为一棵有根树，移动到最喜欢的伙伴对应于移动到父级。 对于同一组件中的两个顶点，包含这两个顶点的任何有效组必须继续跟随最喜欢的伙伴，直到达到共同的祖先。 这样的最低祖先是它们的 LCA，因此最小的可能组正是它们之间的路径。 每个非 LCA 顶点在该路径上都有其父顶点，并且 LCA 是每个路径顶点的祖先，因此该路径满足组规则。 

间隔聚合是正确的，因为顶点在查询时间 (t) 处出现，恰好在其开始时间最多为 (t) 并且其结束时间大于 (t) 时。 对所有开始时间应用最大值，对所有结束时间应用最小值，正好给出了每个路径顶点出现所需的两个条件。 

最后，当小组中的每个学生都知道某个主题时，该主题就会准确地影响最低保证成绩。 按位与精确计算主题集的交集。 线段树在每个重轻线段上组合这些关联聚合，因此最终聚合准确地表示所需的路径。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

INF = 10**9

def solve():
    n, b = map(int, input().split())
    ALL = (1 << b) - 1

    ids = {}

    parent = []
    topic = []
    start = []
    end = []

    def get_id(x):
        v = ids.get(x)
        if v is not None:
            return v

        v = len(parent)
        ids[x] = v
        parent.append(v)
        topic.append(0)
        start.append(INF)
        end.append(0)
        return v

    def read_mask():
        a = list(map(int, input().split()))
        m = 0
        for t in a[1:]:
            m |= 1 << (t - 1)
        return m

    for _ in range(n):
        x_value, f_value = map(int, input().split())

        x = get_id(x_value)
        f = get_id(f_value)

        parent[x] = f
        topic[x] = read_mask()
        start[x] = 0
        end[x] = INF

    q = int(input())
    queries = []

    for t in range(1, q + 1):
        event = list(map(int, input().split()))
        typ = event[0]

        if typ == 0:
            x = get_id(event[1])
            end[x] = t

        elif typ == 1:
            x = get_id(event[1])
            y = get_id(event[2])
            queries.append((t, x, y))

        else:
            x = get_id(event[1])
            f = get_id(event[2])

            parent[x] = f
            topic[x] = read_mask()
            start[x] = t
            end[x] = INF

    N = len(parent)

    children = [[] for _ in range(N)]
    roots = []

    for v in range(N):
        p = parent[v]
        if p == v:
            roots.append(v)
        else:
            children[p].append(v)

    depth = [0] * N
    component = [0] * N
    order = []

    for root in roots:
        stack = [root]
        component[root] = root

        while stack:
            u = stack.pop()
            order.append(u)

            du = depth[u] + 1
            for v in children[u]:
                depth[v] = du
                component[v] = root
                stack.append(v)

    size = [1] * N
    heavy = [-1] * N

    for u in reversed(order):
        best_size = 0
        total = 1

        for v in children[u]:
            sv = size[v]
            total += sv
            if sv > best_size:
                best_size = sv
                heavy[u] = v

        size[u] = total

    head = [0] * N
    pos = [0] * N

    base_topic = [0] * N
    base_start = [0] * N
    base_end = [0] * N

    cur = 0
    stack = []

    for root in roots:
        stack.append((root, root))

        while stack:
            u, h = stack.pop()

            while u != -1:
                head[u] = h
                pos[u] = cur

                base_topic[cur] = topic[u]
                base_start[cur] = start[u]
                base_end[cur] = end[u]

                cur += 1

                hv = heavy[u]

                for v in children[u]:
                    if v != hv:
                        stack.append((v, v))

                u = hv

    size_tree = 1
    while size_tree < N:
        size_tree <<= 1

    seg_topic = array('i', [ALL]) * (2 * size_tree)
    seg_start = array('i', [-1]) * (2 * size_tree)
    seg_end = array('i', [INF]) * (2 * size_tree)

    for i in range(N):
        p = size_tree + i
        seg_topic[p] = base_topic[i]
        seg_start[p] = base_start[i]
        seg_end[p] = base_end[i]

    for p in range(size_tree - 1, 0, -1):
        left = p << 1
        right = left | 1

        seg_topic[p] = seg_topic[left] & seg_topic[right]
        seg_start[p] = max(seg_start[left], seg_start[right])
        seg_end[p] = min(seg_end[left], seg_end[right])

    def range_query(l, r):
        l += size_tree
        r += size_tree

        ans_topic = ALL
        ans_start = -1
        ans_end = INF

        while l < r:
            if l & 1:
                ans_topic &= seg_topic[l]
                s = seg_start[l]
                e = seg_end[l]

                if s > ans_start:
                    ans_start = s
                if e < ans_end:
                    ans_end = e

                l += 1

            if r & 1:
                r -= 1

                ans_topic &= seg_topic[r]
                s = seg_start[r]
                e = seg_end[r]

                if s > ans_start:
                    ans_start = s
                if e < ans_end:
                    ans_end = e

            l >>= 1
            r >>= 1

        return ans_topic, ans_start, ans_end

    def path_query(x, y):
        if component[x] != component[y]:
            return None

        ans_topic = ALL
        ans_start = -1
        ans_end = INF

        while head[x] != head[y]:
            if depth[head[x]] < depth[head[y]]:
                x, y = y, x

            h = head[x]

            a, s, e = range_query(pos[h], pos[x] + 1)

            ans_topic &= a
            if s > ans_start:
                ans_start = s
            if e < ans_end:
                ans_end = e

            x = parent[h]

        l = pos[x]
        r = pos[y]

        if l > r:
            l, r = r, l

        a, s, e = range_query(l, r + 1)

        ans_topic &= a
        if s > ans_start:
            ans_start = s
        if e < ans_end:
            ans_end = e

        return ans_topic, ans_start, ans_end

    out = []

    for t, x, y in queries:
        result = path_query(x, y)

        if result is None:
            out.append("-1")
            continue

        common_topic, latest_start, earliest_end = result

        if latest_start > t or earliest_end <= t:
            out.append("-1")
        else:
            out.append(str(common_topic.bit_count()))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入阶段首先为每个标识符创建一个压缩整数索引。 这是必要的，因为标识符本身可以大到 (10^9)，而所有数据结构只需要从 (0) 到 (N-1) 的索引。 

事件阶段不会立即执行查询。 相反，它记录每个查询并完成计算每个学生的完整上课间隔。 这是线下转型的关键。 出发仅更改间隔的终点，而到达则固定其起点。 

然后森林就建立一次。 迭代遍历避免了 Python 递归，这在 (10^5) 或更多顶点的链上是不安全的。 这`heavy`数组标识最大的子子树，分解将连续位置分配给重链。 

线段树准确地存储了证明所需的三个路径聚合。`seg_topic`使用按位与，`seg_start`使用最大值，并且`seg_end`使用最少。 所有三个操作都是关联的，因此间隔可以按任何顺序组合。 

路径查询总是将更深的重链头向上移动。 一旦两个端点具有相同的链头，它们的剩余路径就是一个连续的段。 最后的范围查询仅包含一次最低共同祖先。 

区间比较使用`latest_start > t`和`earliest_end <= t`。 最后的严格不平等是必要的，因为在事件 (t) 离开的学生在时间 (t) 无法进行查询。 相反，到达事件 (t) 的学生在该事件之后有空，因此在处理稍后的查询时会接受其开始时间。 

Python 中不存在整数溢出问题。 在线段树中，`array('i')`存储是安全的，因为主题掩码低于 (2^{20}) 并且事件时间最多为 (10^5)。 

## 工作示例

 ### 示例 1

 有一个学生，那个学生指着自己。 唯一的问题是要求学生和他们自己一起。 

| 活动时间| 查询 | 路径| 最新开始 | 最早结束 | 普通口罩| 回答 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | (1,1) | (1) | 0 | 信息 | 1 | 1 |

 该路径包含一名学生，他知道唯一的主题。 单例组有效，其一个掩码的 AND 为`1`, 给予评分`1`。 

### 示例 2

 最初的森林是链

 [
 1 \右箭头 2 \右箭头 3 \右箭头 4 \右箭头 5 \右箭头 6 \右箭头 7。 
]

 学生 (7) 是一个根。 所有初始学生均在零时间到场。 

| 活动时间| 活动 | 路径| 最新开始 | 最早结束 | 普通口罩| 结果 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 查询 (3,5) | (3,4,5) | 0 | 信息 |`1111`| 4 |
 | 2 | 查询 (5,7) | (5,6,7) | 0 | 信息 |`1101`| 3 |
 | 3 | 学生 4 叶 | | | | | |
 | 4 | 查询 (3,5) | (3,4,5) | 0 | 3 |`1111`| -1 |
 | 5 | 学生 8 到达，家长 4 | | | | | |
 | 6 | 查询 (8,4) | (8,4) | 5 | 3 |`1111`| -1 |
 | 7 | 查询 (8,8) | (8) | 5 | 信息 |`1111`| 4 |
 | 8 | 查询 (1,1) | (1) | 0 | 信息 |`1000`| 1 |

 对于第一个查询，学生 3、4 和 5 都知道所有四个主题，因此 AND 仍然存在`1111`。 对于第二个查询，学生 6 只知道主题 1、2 和 4，因此路径 AND 具有三个设置位。 

学生4离开后，静态树中仍然存在3到5之间的路径，但其最早结束时间为3。在查询时间4，`earliest_end <= query_time`，因此目前无法形成该组。 学生 8 的迟到不会重新激活学生 4，因此涉及 8 和 4 的查询仍然不可能。 8 的单例查询是有效的，并且给出了所有四个主题。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((N+Q)\log N + Q\log^2 N)) | 树预处理和线段树构建是近线性对数预处理，每条路径都穿过 (O(\log N)) 重链，每个线段需要 (O(\log N)) 工作 |
 | 空间| (O(N+Q)) | 压缩学生、事件查询、HLD数组和线段树在输入大小上都是线性的 |

 这里 (N) 是出现在输入中任意位置的不同学生标识符的数量。 它在最初的学生和事件中是线性的。 重要的是，潜在 (10^5) 长的路径永远不会逐个顶点进行扫描。 重轻分解将其减少到对数多个线段树范围，这符合预期的约束。 

## 测试用例

 以下线束假设`solve()`上述解决方案中的功能可在同一模块中使用。```python
import sys
import io
from contextlib import redirect_stdout

# Use the solve() function from the solution above.
# For example:
# from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    output = io.StringIO()

    try:
        with redirect_stdout(output):
            solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return output.getvalue().strip()

sample1 = """\
1 1
1 2
1 1
1
1 1 1
"""

assert run(sample1) == "1", "sample 1"

sample2 = """\
7 4
1 2
1 4
2 3
1 1
3 4
4 1 2 3 4
4 5
4 3 1 2 4
5 6
4 1 4 2 3
6 7
3 1 2 4
7 7
4 4 1 2 3
8
1 3 5
1 5 7
0 4
1 3 5
2 8 4
4 3 4 1 2
1 8 4
1 8 8
1 1 1
"""

assert run(sample2) == "4\n3\n-1\n-1\n4\n1", "sample 2"

minimum_case = """\
1 1
1 1
1 1
1
1 1 1
"""

assert run(minimum_case) == "1", "minimum-size singleton"

disconnected_case = """\
2 20
1 1
1 20
2 2
1 20
1
1 1 2
"""

assert run(disconnected_case) == "-1", "different components and topic 20"

departure_case = """\
3 2
1 2
2 1 2
2 3
2 1 2
3 3
2 1 2
3
1 1 3
0 2
1 1 3
"""

assert run(departure_case) == "2\n-1", "inactive intermediate vertex"

arrival_case = """\
1 1
1 2
1 1
3
1 1 2
2 2 2
1 1
1 1 2
"""

assert run(arrival_case) == "-1\n1", "parent arrives later"

# Maximum-size stress case.
# 100000 initial students form one chain and there are 100000 queries.
n = 100000
q = 100000

parts = [f"{n} 1\n"]

for i in range(1, n):
    parts.append(f"{i} {i + 1}\n1 1\n")

parts.append(f"{n} {n}\n1 1\n")
parts.append(f"{q}\n")

for _ in range(q):
    parts.append(f"1 1 {n}\n")

maximum_case = "".join(parts)
expected = "\n".join(["1"] * q)

assert run(maximum_case) == expected, "maximum-size chain and query count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一名学生指着自己 |`1`| 最小输入和单例路径 |
 | 主题 20 | 两个独立的根`-1`| 不同的组成部分和最高的主题指数 |
 | 中学生离开的三节点链 |`2`， 然后`-1`| 路径可用性和出发边界 |
 | 孩子在父母到达之前出现 |`-1`， 然后`1`| 到达间隔和家长稍后出现 |
 | 100000 个节点的链，100000 个查询 |`1`重复100000次| 最大规模的预处理和查询处理 |

 ## 边缘情况

 ### 单例查询

 对于```
1 1
1 1
1 1
1
1 1 1
```学生是一个根并且最初就存在。 重轻分解为学生分配一个位置，并且查询的线段树范围恰好包含该位置。 总计为`mask = 1`,`latestStart = 0`， 和`earliestEnd = INF`。 在查询时间 1，学生处于活动状态，因此答案为`1`。 

### 不同的组件

 对于```
2 1
1 1
1 1
2 2
1 1
1
1 1 2
```学生 1 和学生 2 是单独组件的根。 它们的组件标识符不同，因此路径查询立即返回`None`。 没有尝试线段树查询，答案是`-1`。 

### 中级学生离开

 对于```
3 2
1 2
2 1 2
2 3
2 1 2
3 3
2 1 2
3
1 1 3
0 2
1 1 3
```在时间 1，路径是 (1,2,3)，并且所有三个学生都知道这两个主题。 总计为`11`，它有两个设置位。 在时间 2，学生 2 收到`end = 2`。 第二个查询发生在时间 3，因此路径聚合有`earliestEnd = 2`。 自从`2 <= 3`，路径包含不再存在的学生，答案变为`-1`。 

### 家长在孩子之后到达

 对于```
1 1
1 2
1 1
3
1 1 2
2 2 2
1 1
1 1 2
```学生 2 从一开始就存在于压缩森林中，因为它是学生 1 最喜欢的伙伴，但其默认间隔为空。 因此第一个查询看到`earliestEnd = 0`并失败了。 在事件 2 中，学生 2 到达并收到`start = 2`。 最终查询发生在时间 3，因此两个学生都处于活动状态并且路径有效。 

### 学生恰好在查询时间离开

 该实现将时间 (t) 的出发视为`end = t`。 活跃条件是`t < end`， 不是`t <= end`。 因此，如果学生在事件 5 处离开，则时间 5 处的查询无法使用该学生。 该边界由`earliestEnd <= queryTime`。 

### 学生在稍后查询之前到达

 到达时间 (t) 接收`start = t`，并且稍后在时间 (t+1) 的查询满足`start <= queryTime`。 仅对出发时间需要进行严格比较，因为间隔表示为`[start, end)`。 

### 查询的标识符永远不会到达

 这样的标识符仍然被插入到压缩图中。 它的默认间隔为空，开始时间大于每个可能的查询，结束时间为零。 因此，包含该学生的任何查询都无法通过可用性检查，而不是导致字典查找失败或无效的树索引。 

### 最喜欢的伙伴从来不会以学生身份出现

 最喜欢的伙伴仍然表示为一个顶点，但它仍然处于非活动状态。 如果一条路径需要该顶点，则其间隔会使查询无效。 这是必要的，因为缺席的父母不能默默地充当一个群体的普遍特殊伙伴。
