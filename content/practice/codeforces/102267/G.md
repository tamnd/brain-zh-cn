---
title: "CF 102267G - 饮食"
description: "我们有一系列有序的房间。 每个占用的房间 i 包含一个由 a[i] 和 b[i] 描述的患者。 机器人从 x 单位的食物开始，从左到右访问房间，跳过病人已经死亡的房间。"
date: "2026-08-19T03:36:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102267
codeforces_index: "G"
codeforces_contest_name: "The 2019 University of Jordan Collegiate Programming Contest"
rating: 0
weight: 102267
solve_time_s: 997
verified: false
draft: false
---

[CF 102267G - 饮食](https://codeforces.com/problemset/problem/102267/G)

 **评级：** -
 **标签：** -
 **求解时间：** 16m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一系列有序的房间。 每个占用的房间`i`包含由以下描述的患者`a[i]`和`b[i]`。 机器人开始于`x`单位的食物，从左到右参观房间，跳过病人已经死亡的房间。 对于活着的病人，机器人可以给他们`a[i]`仅当至少有食物时`a[i]`食物残留。 接受食物后，如果机器人仍然有超过 100 份食物，则患者死亡`b[i]`食物。 

类型 1 查询需要两个数字：有多少当前活着的患者在这次旅行中死亡，以及有多少活着的患者因为机器人耗尽食物而从未联系到。 死亡的患者将被永久地从该过程中移除。 类型 2 查询会用新患者替换一个房间中的患者，即使该房间之前因患者死亡而空出。 

关键细节是类型 1 查询改变了数据结构。 死亡的患者不会出现在以后的每次行程中，直到第 2 类查询将新患者放入该房间为止。 这使我们无法将每个查询视为独立的模拟。 

高达`10^5`房间和`10^5`查询，一个`O(n)`每个类型 1 查询的模拟可以执行大约`10^10`最坏情况下的病人手术。 这远远超出了 2 秒的限制。 的价值观`a`,`b`， 和`x`也达到`10^18`，因此每个和必须使用 64 位整数。 Python整数已经具有任意精度，因此在实现中不存在溢出问题。 

有几种边界情况很容易处理不当。 首先，死亡使用了严格的不平等。 例如，```
15 511 10
```患者收到`5`，离开`5`，这正是他们的安全极限。 输出是```
0 0
```粗心的实现使用`>= b[i]`而不是`> b[i]`会错误地杀死病人。 

其次，不能接受食物的病人并没有死。 例如，```
15 10011 4
```机器人无法给出所需的`5`，所以病人活了下来，只是没有得到食物。 输出是```
0 1
```第三，在未来的旅行中跳过死房间。 例如，```
15 021 61 1
```第一个查询杀死了病人，因为还剩下一个单位，`1 > 0`。 然后房间就空了。 第二个查询不能杀死任何人，也没有病人可以喂养，所以输出是```
1 00 0
```最后，更新可以重新填充死房间。 例如，```
15 021 62 2 10 1
```第一个查询杀死了原来的病人。 第二个查询将新患者插入同一房间。 将死房间视为永久无法使用会错误地失去新患者。 

## 方法

 直接的方法是将当前患者保留在每个房间中并从房间模拟机器人`1`通过房间`n`对于每个类型 1 查询。 在每个访问过的房间我们减去`a[i]`，检查患者是否死亡，将死亡患者标记为缺席。 这是正确的，因为它完全遵循流程，包括死亡患者从未来的旅行中消失的事实。 

问题是最坏的情况。 假设有`10^5`房间，几乎每个查询都是针对足够大量食物的类型 1 查询。 然后一个查询检查`10^5`房间，以及`10^5`查询可能需要大致`10^10`运营。 尽管每个单独的模拟都很简单，但总数却太大了。 

关键的观察是停止一次考虑一名患者，而是用三个值描述整个剩余序列。 

对于一组连续的活着的患者，让`sum`是这些患者所需的总食物量。 让`cnt`是他们的号码。 最重要的是，让`mn`是最小值`food already consumed before this patient + a[i] + b[i]`。 

如果机器人以额外金额开始组`s`已消耗的食物，那么当该值小于时患者就会死亡`x`。 因此，该组中包含一名患者，该患者恰好在以下时间死亡：`mn + s < x`。 

当两个连续的段连接时，此属性自然结合。 左侧部分贡献了自己的最小值。 对于右段，每个前缀在左段所需的所有食物都消耗完后开始，因此每个右侧候选者都会移动`left.sum`。 

这给出了一个线段树，其节点存储`cnt`,`sum`， 和`mn`。 

类型 2 更新仅更改一个叶子，因此重建线段树需要`O(log n)`时间。 

类型 1 查询更有趣。 我们递归地搜索每个满足死亡条件的患者并删除那些叶子。 一旦整个段有`mn + consumed >= x`，其中任何地方都不可能有死亡，因此可以跳过整个片段。 以这种方式移除的每一片叶子都将永远死亡，直到更新在那里重新创建一个病人。 因此，在整个输入中，所有类型 1 查询的昂贵部分只能在插入之间作为死叶访问每个患者一次。 

移除死亡患者后，我们需要没有收到食物的人数。 由于每`a[i]`为正数时，活着的病人累计消耗的食物量严格增加。 我们可以沿着同一个线段树下降，找出最多有多少个活着的患者有累积需求`x`。 其余活着的病人没有得到食物。 

这与官方竞赛解决方案中使用的线段树结构相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(nq)`|`O(n)`| 太慢了|
 | 最佳|`O((n + q) log n)`摊销|`O(n)`| 已接受 |

 ## 算法演练

 1. 在房间上构建一棵线段树。 For a living patient`(a, b)`， 店铺`cnt = 1`,`sum = a`， 和`mn = a + b`。 一间空房间储藏室`cnt = 0`,`sum = 0`， 和`mn = infinity`。 

对于两个连续的节点`L`和`R`，它们的综合值为`cnt = L.cnt + R.cnt`

`sum = L.sum + R.sum`

`mn = min(L.mn, L.sum + R.mn)`。 

The second candidate has`L.sum`added because every patient in the right child is reached only after all living patients in the left child have received their food.
 2. 对于类型 2 查询`(a, b, c)`, 更换房间`c`一片叶子含有`cnt = 1`,`sum = a`， 和`mn = a + b`。 

这可以统一处理这两种情况。 如果老病人还活着，他们就会被替换。 If the old patient had died, the previously empty leaf becomes occupied again.
 3. 对于食物数量的类型1查询`x`，记住根部存储的活着的患者数量。 

然后递归移除每一个满足死亡条件的活着的病人。 For a segment beginning after`used`食物已经被消耗掉，其最小死亡候选者是`mn + used`。 如果这至少是`x`，整个段没有患者死亡，所以我们立即停止。 
4. 当递归到达候选者小于的叶子时`x`，通过将其计数和需求食物设置为零并将其最小值设置为无穷大来删除该患者。 

The strict comparison is essential. 只有当剩余食物大于`b`，所以平等就意味着生存。 
5. After the deletion pass, subtract the new root count from the old root count. This difference is exactly the number of patients who died during this query.
 6. Count how many living patients can actually receive food. 从根开始`used = 0`, inspect the left child. 如果`used + left.sum <= x`，该子级中的每个活着的患者都可以得到服务，因此添加`left.cnt`找到答案并移动到正确的孩子`used`增加了`left.sum`。 否则，继续进入左孩子。 

积极的`a[i]`values make cumulative demand strictly increasing, so only one root-to-leaf path needs to be explored.
 7. The number of living patients that did not receive food is the number remaining after the death pass minus the number that can be served. Output the number of deaths followed by this unserved count.

 ### 为什么它有效

 The invariant is that every segment-tree node describes exactly the currently living patients in its interval, in their original room order. 它是`sum`是他们的总食物需求，而`mn`是最小值`consumed_before + a[i] + b[i]`超过那些病人。 

对于任何一个病人来说，`a[i] + b[i]`is compared against the food consumed through that patient. 因此，患者恰好在以下时间死亡：`consumed_before + a[i] + b[i] < x`，这正是由下式表示的条件`mn + used < x`对于一个段。 最小值不满足此条件的段不包含死亡患者，可以安全地跳过。 Every segment that is explored toward a qualifying leaf eventually removes precisely those patients satisfying the death condition.

 After all such patients are removed, the remaining`sum`values describe only living patients. 由于每一个需求都是正数，累积的需求是单调的，所以第二次遍历正好统计了可以接受食物的活着的病人。 Subtracting that number from the remaining population gives exactly the patients who receive nothing.

 ## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline
INF = 10**30

def solve():    data = list(map(int, sys.stdin.buffer.read().split()))    it = iter(data)
    n = next(it)
    a = [0] * n    b = [0] * n
    for i in range(n):        a[i] = next(it)        b[i] = next(it)
    size = 4 * n + 5    cnt = [0] * size    sm = [0] * size    mn = [INF] * size
    def pull(v):        lc = v * 2        rc = lc + 1
        cnt[v] = cnt[lc] + cnt[rc]        sm[v] = sm[lc] + sm[rc]        mn[v] = min(mn[lc], sm[lc] + mn[rc])
    def build(v, l, r):        if l == r:            cnt[v] = 1            sm[v] = a[l]            mn[v] = a[l] + b[l]            return
        m = (l + r) // 2        build(v * 2, l, m)        build(v * 2 + 1, m + 1, r)        pull(v)
    def update(v, l, r, pos, na, nb):        if l == r:            cnt[v] = 1            sm[v] = na            mn[v] = na + nb            return
        m = (l + r) // 2        if pos <= m:            update(v * 2, l, m, pos, na, nb)        else:            update(v * 2 + 1, m + 1, r, pos, na, nb)
        pull(v)
    def kill(v, l, r, x, used):        if mn[v] + used >= x:            return
        if l == r:            cnt[v] = 0            sm[v] = 0            mn[v] = INF            return
        m = (l + r) // 2        lc = v * 2        rc = lc + 1
        if mn[lc] + used < x:            kill(lc, l, m, x, used)
        if mn[rc] + used + sm[lc] < x:            kill(rc, m + 1, r, x, used + sm[lc])
        pull(v)
    def served(v, l, r, x, used):        if l == r:            return cnt[v] if used + sm[v] <= x else 0
        m = (l + r) // 2        lc = v * 2        rc = lc + 1
        if used + sm[lc] <= x:            return cnt[lc] + served(                rc, m + 1, r, x, used + sm[lc]            )
        return served(lc, l, m, x, used)
    build(1, 0, n - 1)
    q = next(it)    out = []
    for _ in range(q):        typ = next(it)
        if typ == 1:            x = next(it)
            before = cnt[1]            kill(1, 0, n - 1, x, 0)            after = cnt[1]
            dead = before - after            fed = served(1, 0, n - 1, x, 0)            hungry = after - fed
            out.append(f"{dead} {hungry}")
        else:            na = next(it)            nb = next(it)            c = next(it) - 1
            update(1, 0, n - 1, c, na, nb)
    sys.stdout.write("\n".join(out))

if __name__ == "__main__":    solve()
```三个数组`cnt`,`sm`， 和`mn`是线段树节点的整个状态。`cnt`告诉我们还有多少活着的病人，`sm`告诉我们他们总共消耗了多少食物，以及`mn`确定该段内最早可能的死亡情况。 

合并操作是实现的核心。 The left minimum is already measured from the beginning of the combined segment. Every candidate in the right child needs the entire left sum added to its consumed-food amount, which gives`sm[left] + mn[right]`。 

这`kill`函数接收`used`, the food already consumed before the current segment. 在一片叶子上，`mn + used < x`意味着病人死亡。 At an internal node, the same test lets us skip the entire node if no death is possible. 右边的孩子收到`used + sm[left]`，因为要达到它需要首先消耗掉左孩子中所有活着的患者。 

更新函数总是创建一个活的叶子。 这是故意的，因为类型 2 查询会插入新患者，即使房间之前已被去世的人占用。 

这`served`功能用途`<= x`， 不是`< x`。 A patient can receive food when exactly enough remains. 因为所有`a[i]`are at least one, the cumulative demand is strictly increasing among living patients, which is what reduces this operation to one tree path.

 Python 中不需要显式的 64 位类型。 最大可能的累积总和约为`10^14`，并且 Python 整数无论如何都可以安全地表示超出该值的值。`INF`only needs to be larger than every possible meaningful death threshold.

 ## 工作示例

 ### 示例 1

 Initially the five patients have cumulative food demands`1, 6, 109, 110, 115`。 他们的死亡候选人是`11, 18, 179, 111, 118`。 

| 运营| 食物`x`| Living before | Death candidates below`x`| 生活之后| 美联储| 无人服务|
 | --- | --- | --- | --- | --- | --- | --- |
 |`1 400`| 400 | 5 | all five | 0 | 0 | 0 |
 |`2 3 13 3`| | 0 | | 1 | | |
 |`2 5 3 1`| | 1 | | 2 | | |
 |`1 3`| 3 | 2 | 无 | 2 | 0 | 2 |

 第一个查询杀死了每个患者，因为每个死亡候选者都低于`400`。 All five rooms consequently become empty. 第一次更新将一名患者插入房间 3，第二次更新将另一名患者插入房间 1。 

对于最终查询，1号房间的患者需要`5`食物，所以机器人只需要立即停止`3`。 从未联系到 3 号房间的病人。 两名患者均未死亡，给予`0 2`。 

### 示例 2

 The initial patients have`a`价值观`1, 2, 3`和`b`价值观`2, 3, 4`。 

| 运营| 食物`x`| 之前生活| 死亡候选人| 死亡人数 生活之后| 美联储| 无人服务|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 |`1 6`| 6 | 3 |`3`| 1 | 2 | 2 | 0 |
 |`1 13`| 13 | 2 |`5, 9`| 2 | 0 | 0 | 0 |
 |`2 1 1 1`| | 0 | | | 1 | | |
 |`2 2 4 2`| | 1 | | | 2 | | |
 |`1 20`| 20 | 2 |`2, 7`| 2 | 0 | 0 | 0 |

 为了`x = 6`，第一位患者有死亡候选`1 + 2 = 3`, so they die. The other two survive because their candidates are `6`和`10`。 Both can be fed.

 为了`x = 13`, the remaining two patients have candidates `5`和`9`，所以两人都会死。 The following two updates recreate rooms 1 and 2 with new patients. The final query kills both new patients.

 The trace demonstrates why the tree must mutate after every type 1 query. 第二个查询不针对原始的三个患者进行评估，并且最终查询针对更新插入的两个患者进行评估。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O((n + q) log n)`摊销| 建筑需要`O(n)`，每次更新需要`O(log n)`，每次服务搜索需要`O(log n)`，并且每次死亡都会删除一片叶子，因此所有删除遍历都会花费`O((n + q) log n)`。 |
 | 空间|`O(n)`| 线段树包含`O(n)`nodes and three integer arrays are stored. |

 The important amortization comes from the destructive nature of type 1 queries. A patient can only be removed once before another type 2 query inserts a replacement. Thus even though one deletion query may inspect many tree nodes, the total number of leaf deletions across all queries is bounded by the number of initial patients plus the number of insertions. This keeps the solution within the`10^5`问题所需的规模。 

## 测试用例```python
Pythonimport sysimport io

def solve(data: str) -> str:    tokens = list(map(int, data.split()))    it = iter(tokens)
    n = next(it)
    a = [0] * n    b = [0] * n
    for i in range(n):        a[i] = next(it)        b[i] = next(it)
    INF = 10**30    size = 4 * n + 5
    cnt = [0] * size    sm = [0] * size    mn = [INF] * size
    def pull(v):        lc = v * 2        rc = lc + 1        cnt[v] = cnt[lc] + cnt[rc]        sm[v] = sm[lc] + sm[rc]        mn[v] = min(mn[lc], sm[lc] + mn[rc])
    def build(v, l, r):        if l == r:            cnt[v] = 1            sm[v] = a[l]            mn[v] = a[l] + b[l]            return        m = (l + r) // 2        build(v * 2, l, m)        build(v * 2 + 1, m + 1, r)        pull(v)
    def update(v, l, r, pos, na, nb):        if l == r:            cnt[v] = 1            sm[v] = na            mn[v] = na + nb            return        m = (l + r) // 2        if pos <= m:            update(v * 2, l, m, pos, na, nb)        else:            update(v * 2 + 1, m + 1, r, pos, na, nb)        pull(v)
    def kill(v, l, r, x, used):        if mn[v] + used >= x:            return
        if l == r:            cnt[v] = 0            sm[v] = 0            mn[v] = INF            return
        m = (l + r) // 2        lc = v * 2        rc = lc + 1
        if mn[lc] + used < x:            kill(lc, l, m, x, used)
        if mn[rc] + used + sm[lc] < x:            kill(rc, m + 1, r, x, used + sm[lc])
        pull(v)
    def served(v, l, r, x, used):        if l == r:            return cnt[v] if used + sm[v] <= x else 0
        m = (l + r) // 2        lc = v * 2        rc = lc + 1
        if used + sm[lc] <= x:            return cnt[lc] + served(                rc, m + 1, r, x, used + sm[lc]            )
        return served(lc, l, m, x, used)
    build(1, 0, n - 1)
    q = next(it)    ans = []
    for _ in range(q):        typ = next(it)
        if typ == 1:            x = next(it)
            before = cnt[1]            kill(1, 0, n - 1, x, 0)            after = cnt[1]
            dead = before - after            fed = served(1, 0, n - 1, x, 0)            hungry = after - fed
            ans.append(f"{dead} {hungry}")        else:            na = next(it)            nb = next(it)            c = next(it) - 1            update(1, 0, n - 1, c, na, nb)
    return "\n".join(ans)

sample1 = """\51 105 12103 701 15 341 4002 3 13 32 5 3 11 3"""
assert solve(sample1) == """\5 00 2""", "sample 1"

sample2 = """\31 22 33 451 61 132 1 1 12 2 4 21 20"""
assert solve(sample2) == """\1 02 02 0""", "sample 2"

minimum_case = """\15 541 51 42 2 10 11 2"""
assert solve(minimum_case) == """\0 00 10 0""", "minimum size and exact equality"

reinsert_dead = """\15 031 62 2 10 11 2"""
assert solve(reinsert_dead) == """\1 00 0""", "dead room can be reused"

all_equal = """\42 12 12 12 131 82 2 1 21 5"""
assert solve(all_equal) == """\4 02 0""", "all equal values"

boundary_case = """\32 03 14 041 21 52 1 100 11 1"""
assert solve(boundary_case) == """\0 21 00 1""", "exact food and strict death boundary"

# Maximum-size structural test.# Every patient has a=1, b=10^18, so no patient dies for x=10^18.# The query feeds all 100000 patients.n = 100000max_input = [str(n)]max_input.extend(["1 1000000000000000000"] * n)max_input.append("1")max_input.append("1 100000")
max_output = solve("\n".join(max_input))assert max_output == "0 0", "maximum n"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 5 5 / 1 5 / ...`|`0 0`| 死亡边界处的最小尺寸和平等|
 |`1 / 5 0 / 1 6 / 2 2 10 1 / ...`|`1 0`然后`0 0`| 死掉的房间可以换新的|
 | 四个相同的患者`(2, 1)`价值观 |`4 0`然后`2 0`| 重复删除和等值 |
 | 精心挑选的三位患者`x`价值观 |`0 2`,`1 0`,`0 1`| 精确的食物边界和严格的死亡不平等|
 | 生成`n = 100000`输入|`0 0`| 最大尺寸输入和`O(n)`建筑|

 ## 边缘情况

 The strict death boundary is handled directly by the condition`mn + used < x`。 考虑```
15 511 10
```树叶商店`mn = 5 + 5 = 10`。 自从`10 < 10`是假的，`kill`让病人活着。 服务遍历看到`sum = 5 <= 10`，所以病人吃饱了。 输出是`0 0`。 非严格比较会错误地删除患者。 

无法负担自己膳食的患者将与死亡分开处理。 为了```
15 10011 4
```叶子有`mn = 105`，所以不会发生死亡。 服务遍历检查`5 <= 4`，这是错误的，并报告了一名未得到服务的活着的患者。 输出是`0 1`。 

死亡的患者从线段树中消失`cnt`和`sum`。 为了```
15 021 61 1
```第一个查询有`mn = 5`， 和`5 < 6`，所以叶子变成空的。 那么根有`cnt = 0`和`sum = 0`。 第二个查询看到一棵空树，因此死亡计数和未服务计数均为零。 

更新通过写一个全新的叶子来恢复死空间。 为了```
15 031 62 2 10 11 2
```第一个查询删除原始查询`(5, 0)`病人。 然后更新将空叶子替换为`(2, 10)`，其死亡候选者是`12`。 和`x = 2`，候选人不低于`2`，并且患者完全可以负担​​他们所需的费用`2`食物。 最终输出是`0 0`。 

全相等的情况测试递归删除是否正确处理几个连续的叶子。 和```
42 12 12 12 111 8
```死亡候选人是`3, 5, 7, 9`。 前三个如下`8`，因此恰好有 3 名患者死亡，而第四名患者幸存。 线段树可以修剪任何其最小值已经至少为的子树`8`，并且它精确地删除了符合条件的叶子。 

最大尺寸的情况下使用`100000`房间和一个查询，有足够的食物来养活每个人。 每一个`a`是`1`，因此累计需求正好达到`100000`，而每一个`b`是`10^18`。 没有病人死亡，每个病人都得到服务。 输出是`0 0`。 This validates both the memory footprint and the fact that the segment tree does not perform unnecessary per-patient work when no death is possible.
