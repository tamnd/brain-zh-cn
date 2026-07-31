---
title: "CF 102889H - \u5b9d\u53ef\u68a6\u4e0e\u5206\u652f\u8fdb\u5316"
description: "有n种神奇宝贝。 物种 1 是进化家族的根，其他所有物种都只有一个由其进化而来的亲本物种。 这创建了一棵有根树，其中从父代到子代代表了一个进化步骤。"
date: "2026-07-25T12:27:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102889
codeforces_index: "H"
codeforces_contest_name: "The 15-th Beihang University Collegiate Programming Contest (BCPC 2020) - Final"
rating: 0
weight: 102889
solve_time_s: 44
verified: true
draft: false
---

[CF 102889H - \u5b9d\u53ef\u68a6\u4e0e\u5206\u652f\u8fdb\u5316](https://codeforces.com/problemset/problem/102889/H)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 有`n`神奇宝贝种类。 物种`1`是进化家族的根源，所有其他物种都只有一个由其进化而来的亲本物种。 这创建了一棵有根树，其中从父代到子代代表了一个进化步骤。 

院子里有`m`神奇宝贝按照固定的从左到右的顺序排列。 我们希望在保持原始订单的同时尽可能多地挑选它们。 如果一个选定的神奇宝贝出现在另一个神奇宝贝之前，则第二个神奇宝贝必须是进化树中第一个神奇宝贝的后代。 目标是找到这样一个子序列的最大长度。 

序列顺序和树结构相互作用。 选定的神奇宝贝不需要是前一个神奇宝贝的直系子代。 允许任意数量的进化步骤，因此下一个选择的物种只需要位于前一个物种的子树内的某个位置。 

这些约束使得二次动态规划解决方案变得不可能。 院子里的神奇宝贝种类数量和数量都可以达到`5 * 10^5`，所以算法在做`O(nm)`甚至`O(m sqrt(n))`操作不适合一秒的时间限制。 我们需要接近线性或`O((n+m) log n)`工作。 

一个常见的错误是将其视为正常的最长递增子序列问题。 树关系不是基于数字标签，因此比较物种数量会得出毫无意义的结果。 另一个微妙的情况是，下一个被选中的神奇宝贝必须是真正的后代，而不是同一物种。 例如：```
2 2
1
1 1
```正确答案是`1`。 选择两个神奇宝贝将需要第二个物种`1`从第一个物种进化而来`1`，但没有发生进化。 

另一个边缘情况是根物种。 它没有祖先，因此根的第一次出现不能扩展任何先前的链。 例如：```
3 3
1 1
2 1 3
```正确答案是`2`，使用物种`1`其次是物种`3`。 意外地将根视为具有父级的解决方案可能会创建无效的转换。 

重复的物种也需要照顾。 例如：```
3 4
1 2
2 2 3 3
```正确答案是`2`。 物种的两个副本`2`不能被链接在一起，因为一个物种不会进化成它自己。 最好的链条是物种`2`其次是物种`3`。 

## 方法

 直接动态规划的思想是从左到右处理码。 对于每个位置上的神奇宝贝`i`， 定义`dp[i]`作为以该神奇宝贝结尾的最长有效子序列。 我们可以通过查看每个较早的位置来计算它`j`并检查是否`a[j]`是的祖先`a[i]`。 如果是的话，我们可以延长这条链条。 

这种方法是正确的，因为考虑了之前所有可能的选择。 然而，它太慢了。 在最坏的情况下，有`5 * 10^5`神奇宝贝，检查所有之前的位置需要大约`2.5 * 10^11`比较，这是不可能的。 

关键的观察是，我们需要从以前的神奇宝贝那里获得的唯一信息是当前物种祖先中的最佳链长。 当我们处理完一个神奇宝贝种类后`x`，我们将其链长添加为未来后代的候选答案`x`。 未来的查询要求存储在从根到节点的路径上的最大值。 

这将问题转化为两个树操作。 我们需要查询根到节点路径上的最大值（不包括节点本身），并且需要用更大的值更新一个节点。 重轻分解将任何树路径分解为少量连续的段。 然后，重轻顺序的线段树可以有效地回答和更新这些线段。 

暴力解决方案之所以有效，是因为它明确地检查了所有可能的前趋，但由于太多而失败。 树路径最大观察将所有相关前驱压缩为少量范围。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(平方米) | O(米) | 太慢了 |
 | 最佳| O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 根据父代信息构建进化树。 存储每个子项，以便稍后可以遍历树以进行重轻分解。 
2. 计算每个子树的大小并识别每个节点的重子节点。 重孩子是具有最大子树的孩子。 跟随重子节点将重要的路径保持在一起，从而将每个根到节点的路径减少为仅对数数量的片段。 
3. 按照从重到轻的顺序为每个节点分配一个位置。 每个重链按此顺序成为一个连续的段，因此路径查询可以转换为段树范围查询。 
4.从左到右处理院子里的神奇宝贝。 对于目前的物种`x`，查询从根到路径上的最大存储值`parent[x]`。 这给出了可以演变成的最佳先前链`x`。 
5. 将当前链长度设置为查询结果加一。 然后更新位置`x`在线段树中具有该值。 未来的神奇宝贝是 的后代`x`现在可以使用这条链了。 
6. 跟踪扫描过程中产生的最大值，并在处理完所有神奇宝贝后输出。 

为什么查询停止于`parent[x]`是必不可少的。 当前物种不能用作其自己的前身，因为转变至少需要一个进化步骤。 

正确性来自处理第一个之后的不变量`i`神奇宝贝，每个树节点都存储了该物种的已处理神奇宝贝中的最佳子序列长度。 因此，查询当前物种的祖先会准确地返回可能在其之前的最佳神奇宝贝。 更新保留了这个不变量，并且考虑了每个可能的结束位置，因此最大存储值就是答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    children = [[] for _ in range(n + 1)]
    parent = [0] * (n + 1)
    parent[1] = 0

    if n > 1:
        arr = list(map(int, input().split()))
        for i, p in enumerate(arr, 2):
            parent[i] = p
            children[p].append(i)

    a = list(map(int, input().split()))

    depth = [0] * (n + 1)
    order = [1]
    for x in order:
        for y in children[x]:
            depth[y] = depth[x] + 1
            order.append(y)

    size = [1] * (n + 1)
    heavy = [0] * (n + 1)
    for x in reversed(order):
        best_size = 0
        for y in children[x]:
            size[x] += size[y]
            if size[y] > best_size:
                best_size = size[y]
                heavy[x] = y

    head = [0] * (n + 1)
    pos = [0] * (n + 1)
    rev = [0] * (n + 1)
    cur = 0

    stack = [(1, 1)]
    while stack:
        x, h = stack.pop()
        while x:
            head[x] = h
            cur += 1
            pos[x] = cur
            rev[cur] = x

            for y in children[x]:
                if y != heavy[x]:
                    stack.append((y, y))

            x = heavy[x]

    size_seg = 1
    while size_seg < n:
        size_seg *= 2
    seg = [0] * (size_seg * 2)

    def update(i, val):
        i += size_seg - 1
        if seg[i] >= val:
            return
        seg[i] = val
        i //= 2
        while i:
            nv = seg[i * 2] if seg[i * 2] >= seg[i * 2 + 1] else seg[i * 2 + 1]
            if seg[i] == nv:
                break
            seg[i] = nv
            i //= 2

    def query(l, r):
        if l > r:
            return 0
        l += size_seg - 1
        r += size_seg - 1
        ans = 0
        while l <= r:
            if l & 1:
                if seg[l] > ans:
                    ans = seg[l]
                l += 1
            if not (r & 1):
                if seg[r] > ans:
                    ans = seg[r]
                r -= 1
            l //= 2
            r //= 2
        return ans

    def path_query(x):
        ans = 0
        while head[x] != head[1]:
            val = query(pos[head[x]], pos[x])
            if val > ans:
                ans = val
            x = parent[head[x]]
        val = query(pos[1], pos[x])
        if val > ans:
            ans = val
        return ans

    answer = 0
    for x in a:
        best = 0
        if x != 1:
            best = path_query(parent[x])
        dp = best + 1
        if dp > answer:
            answer = dp
        update(pos[x], dp)

    print(answer)

if __name__ == "__main__":
    solve()
```代码的第一部分构建树并计算重轻分解。 遍历顺序是迭代存储的，因为树可以包含`5 * 10^5`节点数，递归DFS可能会超出Python的递归限制。 

这`size`和`heavy`数组确定哪个子项属于同一重链。 分解为每个节点分配一个位置，使得每条重链都成为一个连续的区间。 

线段树存储以每个物种结束的最佳子序列长度。 更新操作使用`max`因为同种的后来的神奇宝贝只能提高后代的可用价值。 

这`path_query`函数回答祖先查询。 在查询之前，主循环移动到`parent[x]`，这会将当前物种排除在考虑范围之外。 这可以防止相同物种之间的无效转换。 

所有值最多为`m`，因此 Python 整数可以轻松处理它们。 迭代线段树操作避免了递归深度问题并将实现保持在所需的限制内。 

## 工作示例

 对于第一个样本：```
n = 4, m = 5
parents: 1 1 2
sequence: 1 2 2 3 4
```进化树有`1`作为的父母`2`和`3`， 和`2`作为的父母`4`。 

| 职位| 物种 | 最佳祖先值 | 当前 dp | 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 1 | 1 |
 | 2 | 2 | 1 | 2 | 2 |
 | 3 | 2 | 1 | 2 | 2 |
 | 4 | 3 | 1 | 2 | 2 |
 | 5 | 4 | 2 | 3 | 3 |

 物种的两次出现`2`不能互相延伸。 最好的链条是`1 -> 2 -> 4`，给出长度`3`。 

对于第二个样本：```
n = 6, m = 6
parents: 1 2 3 4 5
sequence: 1 2 3 4 5 6
```该树是单链。 

| 职位| 物种 | 最佳祖先值 | 当前 dp | 回答 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 1 | 1 |
 | 2 | 2 | 1 | 2 | 2 |
 | 3 | 3 | 2 | 3 | 3 |
 | 4 | 4 | 3 | 4 | 4 |
 | 5 | 5 | 4 | 5 | 5 |
 | 6 | 6 | 5 | 6 | 6 |

 每个神奇宝贝都可以跟随前一个神奇宝贝，因为每个物种都是前一个物种的后代。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 重轻分解是线性的，每次查询或更新都会触及对数个线段树节点。 |
 | 空间| O(n) | 树数组、分解数组和线段树都使用线性内存。 |

 最大可能的输入包含五十万个物种和五十万个神奇宝贝。 该解决方案在线性预处理阶段后仅对每个 Pokémon 执行对数工作，这符合约束条件。 

## 测试用例```python
import sys
import io

def solve_data(inp):
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, m = map(int, input().split())

    children = [[] for _ in range(n + 1)]
    parent = [0] * (n + 1)
    if n > 1:
        for i, p in enumerate(map(int, input().split()), 2):
            parent[i] = p
            children[p].append(i)

    a = list(map(int, input().split()))

    depth = [0] * (n + 1)
    order = [1]
    for x in order:
        for y in children[x]:
            depth[y] = depth[x] + 1
            order.append(y)

    size = [1] * (n + 1)
    heavy = [0] * (n + 1)
    for x in reversed(order):
        best = 0
        for y in children[x]:
            size[x] += size[y]
            if size[y] > best:
                best = size[y]
                heavy[x] = y

    head = [0] * (n + 1)
    pos = [0] * (n + 1)
    cur = 0
    stack = [(1, 1)]
    while stack:
        x, h = stack.pop()
        while x:
            cur += 1
            head[x] = h
            pos[x] = cur
            for y in children[x]:
                if y != heavy[x]:
                    stack.append((y, y))
            x = heavy[x]

    s = 1
    while s < n:
        s *= 2
    seg = [0] * (2 * s)

    def update(i, v):
        i += s - 1
        seg[i] = max(seg[i], v)
        i //= 2
        while i:
            seg[i] = max(seg[2 * i], seg[2 * i + 1])
            i //= 2

    def query(l, r):
        if l > r:
            return 0
        l += s - 1
        r += s - 1
        res = 0
        while l <= r:
            if l & 1:
                res = max(res, seg[l])
                l += 1
            if not r & 1:
                res = max(res, seg[r])
                r -= 1
            l //= 2
            r //= 2
        return res

    def get(x):
        res = 0
        while head[x] != head[1]:
            res = max(res, query(pos[head[x]], pos[x]))
            x = parent[head[x]]
        return max(res, query(pos[1], pos[x]))

    ans = 0
    for x in a:
        dp = 1
        if x != 1:
            dp = get(parent[x]) + 1
        ans = max(ans, dp)
        update(pos[x], dp)
    return str(ans) + "\n"

assert solve_data("""4 5
1 1 2
1 2 2 3 4
""") == "3\n", "sample 1"

assert solve_data("""6 6
1 2 3 4 5
1 2 3 4 5 6
""") == "6\n", "sample 2"

assert solve_data("""2 2
1
1 1
""") == "1\n", "same species cannot chain"

assert solve_data("""3 3
1 1
2 1 3
""") == "2\n", "root handling"

assert solve_data("""3 4
1 2
2 2 3 3
""") == "2\n", "duplicate species handling"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 第一个样品| 3 | 基本分支树行为 |
 | 第二个样品| 6 | 长单链进化|
 | 两个根种| 1 | 相同的物种在链中不能连续 |
 | 根与子孙混杂| 2 | 根没有祖先 |
 | 重复中间物种 | 2 | 防止自我转换错误 |

 ## 边缘情况

 第一个具有重复根物种的边缘情况：```
2 2
1
1 1
```处理第一个物种时`1`，该树没有祖先查询结果，因此存储的值为`1`。 处理第二个物种时`1`，该算法仍然只查询正确的祖先。 由于没有，它创建了另一个长度链`1`而不是错误地扩展先前的根。 答案依然存在`1`。 

以根为起点的第二个边缘情况：```
3 3
1 1
2 1 3
```第一个物种`2`查询其父级`1`并接收零，产生长度链`1`。 下一个物种`1`也没有祖先并产生长度`1`。 最终物种`3`查询其父级`1`，存储前一个根出现的位置，因此它产生长度`2`。 算法正确找到链`1 -> 3`。 

具有重复中间物种的第三种边缘情况：```
3 4
1 2
2 2 3 3
```第一个物种`2`存储长度`1`。 第二种`2`无法读取该值，因为查询在其父级（即物种）处停止`1`，所以它也得到长度`1`。 当种`3`出现后，它可以使用物种的存储值`2`，生产长度`2`。 结果符合所需的演化规则。
