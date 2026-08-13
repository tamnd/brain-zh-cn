---
title: "CF 102423G - 跳跃路径"
description: "我们有一棵有根的树。 每个顶点都有一个整数标签。 跳跃路径是严格向下穿过树的一系列顶点，其中每个较早的顶点都是每个较晚顶点的祖先。"
date: "2026-08-12T01:17:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102423
codeforces_index: "G"
codeforces_contest_name: "North American Southeast Regional 2019 (Div 1)"
rating: 0
weight: 102423
solve_time_s: 161
verified: true
draft: false
---

[CF 102423G - 跳跃路径](https://codeforces.com/problemset/problem/102423/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根的树。 每个顶点都有一个整数标签。 跳跃路径是严格向下穿过树的一系列顶点，其中每个较早的顶点都是每个较晚顶点的祖先。 我们可以跳过任意数量的普通树边，因此序列中的连续顶点不必是父节点和子节点。 

沿所选顶点的标签必须是非递减的。 例如，如果根到叶链上的标签是（2,5,3,7），我们可以选择（2,5,7）或（2,3,7），但不能选择（2,5,3）。 

对于每个顶点 (v)，自然动态规划问题是最后一个顶点为 (v) 的最长有效跳跃路径。 如果较早选择的顶点 (u) 是 (v) 的祖先，并且标签至多为 (v) 的标签，则结束于 (u) 的有效路径可以由 (v) 扩展。 

输入包含 (n) 个顶点，然后是它们的标签，最后是除根之外的每个顶点的父顶点。 顶点 (i) 的父节点在顶点 (i) 之前给出，因此顶点已经处于从根到叶子的拓扑顺序中。 输出包含所有可能端点的最大路径长度以及具有该长度的路径数量（模 (11092019)）。 官方问题使用 (n\le 10^6) 和 ([0,10^6]) 中的标签值。 

(n) 的大小排除了任何二次方。 在链中，针对每个祖先检查每个顶点已经需要大约 (n(n-1)/2) 次祖先比较，当 (n=10^6) 时，这大约是 (5\cdot10^{11}) 次操作。 即使是 (O(n\sqrt n)) 方法对于 10 秒的竞赛限制来说也太大了。 我们大约需要 (O(n\log 10^6)) 的工作。 

第一个微妙的情况是单个顶点。```
1
7
```由该顶点组成的路径只有一条，所以答案是```
1 1
```将路径数量初始化为零并且仅通过扩展现有祖先来创建路径的实现将错误地生成零路径。 

第二个边缘情况是相同的标签。 考虑```
3
5
5
5
1
2
```该树是一个带有标签 (5,5,5) 的链。 每个顶点都可以延伸终止于其父顶点的路径，因此最长路径的长度为 (3)，并且只有一条这样的路径。 

比较必须是`ancestor_label <= current_label`，不严格`<`。 使用严格比较会错误地回答`1 3`。 

第三种情况涉及具有相同最佳长度的几个不同的前身。 考虑```
3
1
3
2
1
1
```根具有标签 (1)，两个子节点都可以遵循它。 两条路径的长度都是 (2)，所以答案是```
2 2
```一个常见的计数错误是，当几个前任的最佳长度相同时，只保留一个前任。 必须将所有最佳前驱的计数相加。 

最后，节点不得使用自身作为其前任节点。 如果在查询之前将当前标签插入到数据结构中，则相等的标签可能会意外地使当前顶点自行扩展。 必须首先进行查询，然后进行插入。 

## 方法

 直接动态程序在概念上很容易编写。 让`dp[v]`是终止于顶点 (v) 的最长有效跳跃路径，并让`ways[v]`是此类路径的数量。 我们检查（v）的每个祖先（u），其标签最多是（v）的标签。 其中，我们发现最大的`dp[u]`。 然后`dp[v]`比该值多 1，并且`ways[v]`是`ways[u]`超过所有达到该最大值的祖先。 如果没有合适的祖先，则单顶点路径`[v]`给出`dp[v] = 1`和`ways[v] = 1`。 

这种暴力递归是正确的，因为每条以 (v) 结尾的有效路径都有一个唯一的前一个顶点 (u)，并且该前一个顶点必须是 (v) 的祖先，且标签不大于 (v) 的标签。 问题是寻找这些祖先的成本。 在链中，顶点 (i) 有 (i-1) 个可能的前驱，给出

 [
 1+2+\cdots+(n-1)=\frac{n(n-1)}2
 ]

 检查。 对于 (n=10^6)，即 (499,999,500,000) 个检查。 

拯救我们的结构是每个查询都在一条根到当前顶点的路径上执行。 我们不需要来自树的任意部分的信息。 对于固定的当前顶点（v），我们需要对其祖先路径进行一次操作：最多在标签（x_v）中找到最大路径长度以及达到该长度的路径总数。 

想象一下，在由标签索引的线段树中维护属于当前根到（v）路径的信息。 在标签 (x) 处，线段树存储具有该标签的活动祖先之间的最佳路径长度以及达到该长度的路径数量。 对标签 (0) 到 (x_v) 的前缀查询准确地给出了递归所需的前驱信息。 

有一个并发症。 当我们从树的一个分支移动到另一个分支时，数据结构必须表示不同的根到顶点路径。 普通的可变线段树不能同时保留所有分支。 干净的解决办法就是坚持。 每个顶点都有自己的线段树版本，通过插入当前顶点从其父版本获得。 

由于每个顶点的父顶点都有较小的索引，因此我们可以直接按输入顺序处理顶点。 版本`root[v]`准确地表示 (v) 的祖先，包括 (v) 本身。 计算 (v) 时，我们查询`root[parent[v]]`，因此当前顶点尚未插入。 

线段树只有大约二十层，因为标签最多为 (10^6)。 持久更新仅复制一条根到叶路径上的节点。 因此每个顶点都会创建 (O(\log 10^6)) 个新节点。 

对于 Python 来说，普通的 Python 整数列表在这种规模下会消耗太多内存。 下面的实现将子索引存储在`array('i')`并将每个线段树值打包为一个 64 位整数。 高位存储路径长度，低位 24 位存储计数模数 (11092019)。 这使持久结构保持在合理的内存占用范围内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 持久线段树| (O(n\log X)) | (O(n\log X)) | 已接受 |

 这里 (X\le 10^6) 是最大标签值。 

## 算法演练

 1. 存储每个顶点及其父顶点的标签。 因为每个父节点都有一个较小的索引，所以当我们到达 (v) 时，顶点 (v) 所需的所有信息都已经可用。 
2. 定义`root[v]`作为代表 (v) 祖先的持久线段树版本的根，以及由标签索引的最佳路径信息。 对于根顶点，起始版本是空的。 
3. 查询标签区间从(0)到的父版本`label[v]`。 结果是由最大前驱路径长度和具有该长度的前驱路径总数组成的对。 
4. 如果查询没有返回前驱，则赋值`dp[v] = 1`和`ways[v] = 1`。 单个顶点本身形成一条有效路径。 
5. 否则分配`dp[v] = best_length + 1`和`ways[v] = best_count`。 每条以有效前驱结束的最佳路径都可以通过 (v) 进行唯一扩展，因此结果路径的数量恰好是前驱计数。 
6. 创建`root[v]`通过持续插入`(dp[v], ways[v])`在`label[v]`进入父母的版本。 如果几个祖先具有相同的标签和相同的最佳长度，则它们的计数将在该叶子处合并。 
7. 在处理顶点的同时保持全局答案。 如果一个顶点有一个较大的`dp`，替换全局长度和计数。 如果长度相同，则将其相加`ways`到全局计数模 (11092019)。 

查询必须在更新之前发生。 该顺序是防止当前顶点被视为其前任顶点的关键细节。 

### 为什么它有效

 不变量是在处理顶点 (v) 之前，`root[parent[v]]`准确地包含 (v) 的每个祖先的路径信息，而不包含其他顶点。 在每个标签处，存储的值表示以具有该标签的祖先结束的最佳路径以及达到该最佳长度的方法数量。 前缀查询通过`label[v]`因此，准确地考虑可以合法地先于 (v) 的祖先。 

然后，递归会考虑以 (v) 结束的最佳路径的每个可能的最后前趋。 选择最大前导长度给出附加 (v) 后的最大可能长度。 当多个前驱具有相同的长度时，它们的路径集是不相交的，因为它们的最终顶点不同，因此可以将它们的计数相加。 持久更新记录每个后代的结果状态，而不修改属于不同分支的版本。 

由于每条有效的跳跃路径都只有一个最终顶点，因此取最大值`dp[v]`对所有顶点给出全局最优，并求和`ways[v]`在达到最佳值的顶点上，每条最长的路径都只计数一次。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 11092019
COUNT_MASK = (1 << 24) - 1

def solve():
    n = int(input())

    labels = array('i')
    max_label = 0

    for _ in range(n):
        x = int(input())
        labels.append(x)
        if x > max_label:
            max_label = x

    parent = array('i', [0]) * n
    for v in range(1, n):
        parent[v] = int(input()) - 1

    # Use a complete binary range [0, size - 1].
    # size is a power of two larger than every possible label.
    size = 1
    while size <= max_label:
        size <<= 1

    height = size.bit_length() - 1

    # Node 0 is the null node.
    left = array('i', [0])
    right = array('i', [0])
    value = array('Q', [0])

    roots = array('i', [0]) * n

    # Reused fixed-size buffer for the nodes copied on one update.
    path = [0] * (height + 1)

    best_global = 0
    count_global = 0

    for v in range(n):
        if v == 0:
            base_root = 0
        else:
            base_root = roots[parent[v]]

        x = labels[v]

        # Query [0, x] in the persistent binary segment tree.
        node = base_root
        best_len = 0
        best_cnt = 0

        for bit in range(height - 1, -1, -1):
            if node == 0:
                break

            if (x >> bit) & 1:
                child = left[node]
                if child:
                    z = value[child]
                    zlen = z >> 24
                    zcnt = z & COUNT_MASK

                    if zlen > best_len:
                        best_len = zlen
                        best_cnt = zcnt
                    elif zlen == best_len:
                        best_cnt += zcnt

                node = right[node]
            else:
                node = left[node]

        # Include the exact leaf x.
        if node:
            z = value[node]
            zlen = z >> 24
            zcnt = z & COUNT_MASK

            if zlen > best_len:
                best_len = zlen
                best_cnt = zcnt
            elif zlen == best_len:
                best_cnt += zcnt

        best_cnt %= MOD

        if best_len == 0:
            dp = 1
            ways = 1
        else:
            dp = best_len + 1
            ways = best_cnt

        # Persistently insert (dp, ways) at label x.
        #
        # Copy the root first, then copy one child per level.
        old = base_root

        new_root = len(value)
        left.append(left[old])
        right.append(right[old])
        value.append(value[old])
        path[0] = new_root

        cur_old = old
        cur_new = new_root

        for level, bit in enumerate(range(height - 1, -1, -1), 1):
            if (x >> bit) & 1:
                old_child = right[cur_old]

                new_child = len(value)
                left.append(left[old_child])
                right.append(right[old_child])
                value.append(value[old_child])

                right[cur_new] = new_child
                cur_old = old_child
                cur_new = new_child
            else:
                old_child = left[cur_old]

                new_child = len(value)
                left.append(left[old_child])
                right.append(right[old_child])
                value.append(value[old_child])

                left[cur_new] = new_child
                cur_old = old_child
                cur_new = new_child

            path[level] = cur_new

        # Merge the new value with whatever was already stored at label x.
        old_leaf_value = value[cur_new]
        old_len = old_leaf_value >> 24
        old_cnt = old_leaf_value & COUNT_MASK

        if dp > old_len:
            value[cur_new] = (dp << 24) | ways
        elif dp == old_len:
            value[cur_new] = (dp << 24) | ((old_cnt + ways) % MOD)

        # Rebuild the copied ancestors bottom-up.
        for level in range(height - 1, -1, -1):
            p = path[level]
            lv = value[left[p]]
            rv = value[right[p]]

            llen = lv >> 24
            rlen = rv >> 24

            if llen > rlen:
                value[p] = lv
            elif rlen > llen:
                value[p] = rv
            else:
                if llen == 0:
                    value[p] = 0
                else:
                    cnt = (lv & COUNT_MASK) + (rv & COUNT_MASK)
                    value[p] = (llen << 24) | (cnt % MOD)

        roots[v] = new_root

        if dp > best_global:
            best_global = dp
            count_global = ways
        elif dp == best_global:
            count_global += ways
            count_global %= MOD

    print(best_global, count_global % MOD)

if __name__ == "__main__":
    solve()
```输入数组使用`array('i')`而不是 Python 列表，因为一百万个 Python 整数将带来大量的对象开销。 持久线段树是主要的内存消耗者，因此这种表示在 Python 中很重要。 

线段树值打包为`(length << 24) | count`。 模数低于 (2^{24})，因此 24 位足以进行计数。 最大路径长度仅为 (10^6)，因此剩余的高位可以轻松存储长度。 

查询遵循标签的二进制表示形式。 每当 (x) 的相应位为 1 时，整个左子树都包含小于 (x) 的标签，因此可以在继续进入右子树之前立即包含其聚合。 当该位为零时，右子树包含大于 (x) 的值并且必须被忽略。 最后的叶子单独包含在内。 

该更新仅复制一个根到叶路径。 每个复制的节点最初都会继承其旧的子节点并进行聚合，然后指向当前标签的分支将被新复制的子节点替换。 到达叶子后，新的`(dp, ways)`对在那里合并，复制的祖先是从它们的两个孩子重建的。 

固定的`path`array 避免为每个顶点分配一个新的 Python 列表。 由于标签线段树的树深度最多为20，因此其大小相对于(n)是恒定的。 

树处理或线段树中都没有递归。 一棵树本身可以是一百万个顶点的链，因此递归 DFS 可能会超出 Python 的递归限制，并且还会增加不必要的函数调用开销。 

## 工作示例

 官方样本包括五个顶点的链，其标签全部相等。 输入是：```
5
3
3
3
3
3
1
2
3
4
```预期输出是`5 1`。 

对于这条链，每个新顶点都可以扩展终止于其父节点的唯一路径。 

| 顶点| 标签| 最佳前任长度|`dp`|`ways`| 全球结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 3 | 0 | 1 | 1 | 1, 1 |
 | 2 | 3 | 1 | 2 | 1 | 2, 1 |
 | 3 | 3 | 2 | 3 | 1 | 3, 1 |
 | 4 | 3 | 3 | 4 | 1 | 4, 1 |
 | 5 | 3 | 4 | 5 | 1 | 5, 1 |

 由于查询是包容性的，因此可以正确处理等标签条件。 该顶点仅在其自身之后插入`dp`value 已被计算，因此它从不使用自身作为前驱。 

第二个官方样本的标签从 (4) 递减到 (0)：```
5
4
3
2
1
0
1
2
3
4
```预期输出是`1 5`。 

没有顶点可以跟随较早的顶点，因为每个较晚的标签都较小。 

| 顶点| 标签| 最佳前任长度|`dp`|`ways`| 全球结果 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | 0 | 1 | 1 | 1, 1 |
 | 2 | 3 | 0 | 1 | 1 | 1, 2 |
 | 3 | 2 | 0 | 1 | 1 | 1, 3 |
 | 4 | 1 | 0 | 1 | 1 | 1, 4 |
 | 5 | 0 | 0 | 1 | 1 | 1, 5 |

 这说明了为什么答案计算从任意顶点开始的路径。 每个单独的顶点本身就是一条长度为 1 的有效路径，因此最长的路径有 5 条。 

第三个样本是：```
4
1
5
3
6
1
2
3
```预期的答案是`3 2`。 

该树是一个带有标签 (1,5,3,6) 的链。 顶点 3 不能跟随顶点 2，因为 (5>3)，但它可以跟随根。 顶点 4 可以位于顶点 2 或顶点 3 之后。 

| 顶点| 标签| 最佳前任长度|`dp`|`ways`|
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 1 | 1 |
 | 2 | 5 | 1 | 2 | 1 |
 | 3 | 3 | 1 | 2 | 1 |
 | 4 | 6 | 2 | 3 | 2 |

 两条最长的路径是`[1,2,4]`和`[1,3,4]`。 顶点 4 处的 2 计数直接来自两个同样好的前驱计数相加。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log X)) | 每个顶点执行一次前缀查询和一次持久点更新，每次更新都采用 (O(\log X)) |
 | 空间| (O(n\log X)) | 每个持久更新都会创建 (O(\log X)) 个新的线段树节点 |

 这里是(X\le 10^6)，所以对数因子最多是二十左右。 拥有一百万个顶点，在最坏的情况下，持久树包含大约两千万个复制节点。 包装的`array`表示专门用于使该比例在 Python 中实用。 官方输入限制是（10^6）个顶点，而竞赛问题有十秒的时间限制。 

## 测试用例

 以下测试均使用相同的方法`solve()`常规作为提交。 帮助程序暂时替换标准输入并捕获标准输出。```python
import sys
import io
from array import array

MOD = 11092019
COUNT_MASK = (1 << 24) - 1

def solve():
    input = sys.stdin.readline

    n = int(input())

    labels = array('i')
    max_label = 0

    for _ in range(n):
        x = int(input())
        labels.append(x)
        max_label = max(max_label, x)

    parent = array('i', [0]) * n
    for v in range(1, n):
        parent[v] = int(input()) - 1

    size = 1
    while size <= max_label:
        size <<= 1

    height = size.bit_length() - 1

    left = array('i', [0])
    right = array('i', [0])
    value = array('Q', [0])
    roots = array('i', [0]) * n

    path = [0] * (height + 1)

    best_global = 0
    count_global = 0

    for v in range(n):
        base_root = 0 if v == 0 else roots[parent[v]]
        x = labels[v]

        node = base_root
        best_len = 0
        best_cnt = 0

        for bit in range(height - 1, -1, -1):
            if node == 0:
                break

            if (x >> bit) & 1:
                child = left[node]
                if child:
                    z = value[child]
                    zlen = z >> 24
                    zcnt = z & COUNT_MASK

                    if zlen > best_len:
                        best_len = zlen
                        best_cnt = zcnt
                    elif zlen == best_len:
                        best_cnt += zcnt

                node = right[node]
            else:
                node = left[node]

        if node:
            z = value[node]
            zlen = z >> 24
            zcnt = z & COUNT_MASK

            if zlen > best_len:
                best_len = zlen
                best_cnt = zcnt
            elif zlen == best_len:
                best_cnt += zcnt

        best_cnt %= MOD

        if best_len == 0:
            dp = 1
            ways = 1
        else:
            dp = best_len + 1
            ways = best_cnt

        old = base_root

        new_root = len(value)
        left.append(left[old])
        right.append(right[old])
        value.append(value[old])
        path[0] = new_root

        cur_old = old
        cur_new = new_root

        for level, bit in enumerate(range(height - 1, -1, -1), 1):
            if (x >> bit) & 1:
                old_child = right[cur_old]

                new_child = len(value)
                left.append(left[old_child])
                right.append(right[old_child])
                value.append(value[old_child])

                right[cur_new] = new_child
            else:
                old_child = left[cur_old]

                new_child = len(value)
                left.append(left[old_child])
                right.append(right[old_child])
                value.append(value[old_child])

                left[cur_new] = new_child

            cur_old = old_child
            cur_new = new_child
            path[level] = cur_new

        old_leaf_value = value[cur_new]
        old_len = old_leaf_value >> 24
        old_cnt = old_leaf_value & COUNT_MASK

        if dp > old_len:
            value[cur_new] = (dp << 24) | ways
        elif dp == old_len:
            value[cur_new] = (dp << 24) | ((old_cnt + ways) % MOD)

        for level in range(height - 1, -1, -1):
            p = path[level]
            lv = value[left[p]]
            rv = value[right[p]]

            llen = lv >> 24
            rlen = rv >> 24

            if llen > rlen:
                value[p] = lv
            elif rlen > llen:
                value[p] = rv
            elif llen == 0:
                value[p] = 0
            else:
                cnt = (lv & COUNT_MASK) + (rv & COUNT_MASK)
                value[p] = (llen << 24) | (cnt % MOD)

        roots[v] = new_root

        if dp > best_global:
            best_global = dp
            count_global = ways
        elif dp == best_global:
            count_global = (count_global + ways) % MOD

    return f"{best_global} {count_global % MOD}\n"

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve()
    finally:
        sys.stdin = old_stdin

# Provided sample 1
assert run(
    """5
3
3
3
3
3
1
2
3
4
"""
) == "5 1\n", "sample 1"

# Provided sample 2
assert run(
    """5
4
3
2
1
0
1
2
3
4
"""
) == "1 5\n", "sample 2"

# Provided sample 3
assert run(
    """4
1
5
3
6
1
2
3
"""
) == "3 2\n", "sample 3"

# Provided sample 4
assert run(
    """6
1
2
3
4
5
6
1
1
1
1
1
"""
) == "2 5\n", "sample 4"

# Minimum-size input
assert run(
    """1
42
"""
) == "1 1\n", "single vertex"

# All labels equal, chain
assert run(
    """4
7
7
7
7
1
2
3
"""
) == "4 1\n", "equal labels"

# Equal best predecessors, catches counting mistakes
assert run(
    """3
1
3
2
1
1
"""
) == "2 2\n", "two optimal predecessors"

# Boundary case where the root cannot precede a child
assert run(
    """3
5
4
3
1
2
"""
) == "1 3\n", "strictly decreasing chain"

# Maximum-size structural test.
# A million equal labels in a chain have exactly one longest path.
n = 1_000_000
max_input = (
    str(n)
    + "\n"
    + ("1\n" * n)
    + "".join(f"{i}\n" for i in range(1, n))
)
assert run(max_input) == "1000000 1\n", "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 42`|`1 1`| 最小尺寸和前无古人的基本情况|
 | 四个顶点，所有标签`7`，连成一条链 |`4 1`| 包含标签比较和重复相等值 |
 | 根`1`， 孩子们`3`和`2`|`2 2`| 添加多个同等最优前辈的计数 |
 | 链`5,4,3`|`1 3`| 标签较大的前任必须拒绝 |
 | 链中一百万个平等标签 |`1000000 1`| 最大顶点数和线性深度树 |

 最大尺寸测试故意是生成的测试，而不是字面上的百万行块。 它使用相同的输入结构，同时保持测试源的可读性。 在实践中，此测试主要用于检查内存和渐近行为，而不是用于常规单元测试。 

## 边缘情况

 对于单个顶点，例如```
1
7
```父版本为空，因此前缀查询返回长度为零。 该算法因此创建路径`[7]`长度为一，计数为一。 输出是`1 1`。 

对于相同的标签，请考虑```
3
5
5
5
1
2
```当处理顶点 2 时，根的标签 (5) 位于包含查询范围内，因此顶点 2 接收`dp = 2`。 当处理顶点 3 时，顶点 2 的持久版本包含两个具有标签 (5) 的祖先，并且其在该标签处的聚合的长度为 2，计数为 1。 顶点3接收`dp = 3`。 输出是`3 1`。 

对于多个最优前驱，考虑```
3
1
3
2
1
1
```根创建一条长度为一的路径。 两个孩子都可以扩展它，因为两个标签至少都是一个。 每个孩子收到长度二并计数一。 全局答案结合了这两个端点计数并产生`2 2`。 

对于减少标签，```
3
5
4
3
1
2
```对顶点 2 的查询仅限于最多四个标签，因此标签为 5 的根被排除。 顶点 2 开始其自己的路径。 顶点 3 也会发生同样的情况。每个顶点都有`dp = 1`, 给予`1 3`。 

最危险的实现边缘情况是在查询之前插入。 假设当前顶点具有标签 5，并且其父顶点也具有标签 5。 如果首先插入当前顶点，则查询可以看到新插入的状态并生成比实际可能长的路径。 该实现通过查询避免了这种情况`root[parent[v]]`首先并构建`root[v]`仅在之后`dp[v]`和`ways[v]`已确定。 

最后的微妙之处在于对线段树节点进行计数。 两个子节点可以具有相同的最佳长度，但代表不同的路径集，因此必须将它们的计数相加。 如果一个子项的长度严格大于该子项的长度，则只有该子项的计数会幸存。 当多个祖先共享该标签时，在每个内部节点和标签叶上使用相同的合并规则。
