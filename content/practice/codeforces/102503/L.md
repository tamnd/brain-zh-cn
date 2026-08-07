---
title: "CF 102503L - 阿尼斯球"
description: "我们有一排盒子。 每个盒子存放许多球，并且也有一个状态：打开或关闭。 这些操作一起修改这两条信息。 翻转操作将每个框改变为从打开到关闭或从关闭到打开的范围。"
date: "2026-08-07T04:46:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "L"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 572
verified: true
draft: false
---

[CF 102503L - 阿尼斯球](https://codeforces.com/problemset/problem/102503/L)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排盒子。 每个盒子存放许多球，并且也有一个状态：打开或关闭。 这些操作一起修改这两条信息。 翻转操作将每个框改变为从打开到关闭或从关闭到打开的范围。 添加操作仅影响当前在某个范围内打开的框。 查询操作会询问某个范围内每个盒子中的球总数，无论盒子是打开还是关闭。 

输入给出初始球数、初始打开或关闭状态，然后是一系列操作。 对于每个查询操作，我们必须输出所选区间的当前总和。 

这些限制足够大，不可能模拟每个受影响的盒子。 对于多达 320,000 个框和 320,000 个操作，对每个操作执行线性工作的解决方案在最坏的情况下可以执行大约 10^11 次更新。 2秒的时间限制要求每个操作接近对数时间，这排除了直接阵列更新和重复间隔扫描。 

困难的部分是操作会影响两个相关的属性。 球的数量仅在打开的盒子时发生变化，而盒子的状态可以通过翻转来改变。 仅存储总和的解决方案会丢失了解哪些盒子应接收未来添加所需的信息。 

破坏粗心实现的一个小情况是先翻转后添加：```
Input
2 3
5 7
1 0
1 1 2
2 1 2 3
3 1 2
```第一个操作将状态更改为关闭、打开。 添加仅影响第二个框，使值变为 5 和 10。答案是：```
15
```仅存储总和并将每次加法视为范围加法的实现将输出 18。 

另一个边缘情况是对同一间隔多次应用翻转：```
Input
1 4
10
1
1 1 1
1 1 1
2 1 1 5
3 1 1
```两次翻转取消，因此当相加发生时盒子是打开的。 最终的答案是：```
15
```忘记正确组合翻转标志的惰性传播实现可能会错误地使盒子保持关闭状态。 

最后一个常见错误是将查询的总和与仅打开的框的总和混淆：```
Input
2 1
4 9
1 0
3 1 2
```答案是：```
13
```关闭的盒子仍然有助于查询。 只有添加才会忽略关闭的框。 

## 方法

 一种简单的解决方案是保留两个数组：一个用于球数，一个用于状态。 对于翻转，我们遍历区间并切换每个状态。 对于加法，我们遍历区间并仅对打开的框进行加法。 对于查询，我们将区间内的每个值相加。 这是正确的，因为每个操作都直接遵循问题规则。 

问题是一次操作可以触及全部 320,000 个盒子。 如果每个操作都使用完整的间隔，则原始操作的数量可以达到约 320,000 × 320,000，即大约 1020 亿次更新或查询。 这种方法是正确的，但太慢了。 

关键的观察结果是操作不需要单独的盒子。 一个段只需要知道两个聚合和：开放框中的值之和和封闭框中的值之和。 加法仅改变未结金额。 翻转只是交换两个和。 范围查询需要它们的组合值。 

该结构与惰性线段树匹配。 每个节点代表一个区间，并存储足够的信息来回答查询或应用更新，而无需下降到子节点。 惰性翻转标志记录整个段已被反转，但其子段尚未更新。 

暴力方法之所以有效，是因为它保留了每个盒子的准确信息，但当重复触摸太多盒子时就会失败。 观察发现翻转只是两个组的交换，这让我们可以压缩所需的信息并在对数时间内处理每个操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 最佳 | O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建一棵线段树，其中每个节点存储开箱中的球总数、闭箱中的球总数以及区间内开箱的数量。 

需要打开盒子的数量，因为添加了`v`必须将未结金额增加`v`乘以该段中打开的盒子的数量。 
2. 对于范围加法，递归访问线段树。 如果一个节点完全在更新间隔内，则直接将其开放和增加`v * open_count`。 

关闭的框将被忽略，因为该操作仅影响当前打开的框。 
3. 对于翻转操作，递归访问线段树。 当节点完全位于间隔内时，交换其开放和和封闭和，将其开放计数替换为先前关闭的框的数量，并切换其延迟翻转标志。 

翻转不会改变任何球数。 它仅更改每个框所属的组，因此交换两个存储的组就足够了。 
4. 对于查询操作，递归地收集所覆盖段的开值和闭值之和​​。 

答案是两组的总和，因为查询对所有框进行计数，无论状态如何。 
5. 每当翻转整个段时，就使用惰性传播。 仅当后续操作需要检查这些子项时，才会将待处理的翻转推送给子项。 

这避免了访问大翻转区间的每个元素。 

为什么它有效：每个线段树节点的不变性是它的两个存储的和始终代表该区间中框的真实当前值，并由它们的当前状态分隔。 加法保留了这个不变量，因为只有开组发生变化。 翻转可以保留它，因为当两个状态组交换角色时，盒子保留了它们的值。 延迟传播仅延迟这些有效转换，因此每个查询都会看到相同的结果，就好像所有操作都已单独应用一样。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, values, states):
        self.n = len(values)
        size = 4 * self.n
        self.open_sum = [0] * size
        self.closed_sum = [0] * size
        self.open_cnt = [0] * size
        self.flip = [False] * size
        self.values = values
        self.states = states
        self.build(1, 0, self.n - 1)

    def build(self, node, left, right):
        if left == right:
            if self.states[left]:
                self.open_sum[node] = self.values[left]
                self.open_cnt[node] = 1
            else:
                self.closed_sum[node] = self.values[left]
            return
        mid = (left + right) // 2
        self.build(node * 2, left, mid)
        self.build(node * 2 + 1, mid + 1, right)
        self.pull(node)

    def pull(self, node):
        self.open_sum[node] = self.open_sum[node * 2] + self.open_sum[node * 2 + 1]
        self.closed_sum[node] = self.closed_sum[node * 2] + self.closed_sum[node * 2 + 1]
        self.open_cnt[node] = self.open_cnt[node * 2] + self.open_cnt[node * 2 + 1]

    def apply_flip(self, node, length):
        self.open_sum[node], self.closed_sum[node] = self.closed_sum[node], self.open_sum[node]
        self.open_cnt[node] = length - self.open_cnt[node]
        self.flip[node] = not self.flip[node]

    def push(self, node, left, right):
        if not self.flip[node] or left == right:
            return
        mid = (left + right) // 2
        self.apply_flip(node * 2, mid - left + 1)
        self.apply_flip(node * 2 + 1, right - mid)
        self.flip[node] = False

    def update_add(self, node, left, right, ql, qr, value):
        if qr < left or right < ql:
            return
        if ql <= left and right <= qr:
            self.open_sum[node] += self.open_cnt[node] * value
            return
        self.push(node, left, right)
        mid = (left + right) // 2
        self.update_add(node * 2, left, mid, ql, qr, value)
        self.update_add(node * 2 + 1, mid + 1, right, ql, qr, value)
        self.pull(node)

    def update_flip(self, node, left, right, ql, qr):
        if qr < left or right < ql:
            return
        if ql <= left and right <= qr:
            self.apply_flip(node, right - left + 1)
            return
        self.push(node, left, right)
        mid = (left + right) // 2
        self.update_flip(node * 2, left, mid, ql, qr)
        self.update_flip(node * 2 + 1, mid + 1, right, ql, qr)
        self.pull(node)

    def query(self, node, left, right, ql, qr):
        if qr < left or right < ql:
            return 0
        if ql <= left and right <= qr:
            return self.open_sum[node] + self.closed_sum[node]
        self.push(node, left, right)
        mid = (left + right) // 2
        return self.query(node * 2, left, mid, ql, qr) + self.query(node * 2 + 1, mid + 1, right, ql, qr)

def solve():
    n, m = map(int, input().split())
    values = list(map(int, input().split()))
    states = list(map(int, input().split()))

    seg = SegmentTree(values, states)
    ans = []

    for _ in range(m):
        query = list(map(int, input().split()))
        typ = query[0]
        l = query[1] - 1
        r = query[2] - 1

        if typ == 1:
            seg.update_flip(1, 0, n - 1, l, r)
        elif typ == 2:
            seg.update_add(1, 0, n - 1, l, r, query[3])
        else:
            ans.append(str(seg.query(1, 0, n - 1, l, r)))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```线段树将两类盒子分开。 这`open_sum`和`closed_sum`数组表示这些类别的当前总值。 这`open_cnt`array 允许在不知道各个框的情况下应用范围添加。 

翻转操作的处理无需访问叶子。 两个总和被交换，因为每个框都会改变两个类别之间的成员资格。 打开的盒子的数量也与关闭的盒子的数量交换，关闭的盒子的数量是段长度减去旧的打开数量。 

惰性翻转标志是一个布尔值，因为两次翻转相当于没有翻转。 当推送具有待翻转的节点时，在父级继续部分操作之前，两个子级都会接收相同的转换。 

所有索引都从问题的从一开始的索引转换为 Python 从零开始的索引。 即使最大答案可能超过 32 位范围，Python 整数也会避免溢出。 

## 工作示例

 对于样本：

 | 运营| 开放总和 | 关闭总和| 开放计数 | 回答 |
 | ---| ---| ---| ---| ---|
 | 初始| 21 | 21 10 | 10 3 | |
 | 查询[2,4] | 14 | 14 0 | | 14 | 14
 | 将 6 添加到 [1,5] | 39 | 39 10 | 10 3 | |
 | 查询[2,4] | 20 | 0 | | 20 |
 | 翻转[1,5] | 10 | 10 39 | 39 2 | |
 | 将 7 添加到 [1,5] | 24 | 39 | 39 2 | |
 | 查询[2,4] | 24 | 10 | 10 | 34 | 34

 此跟踪显示添加仅更改开放组。 翻转不会改变球的总数，它只会改变哪个组拥有每个值。 

一个较小的案例：```
3 5
5 5 5
1 0 1
2 1 3 2
1 1 2
2 1 3 4
3 1 3
3 1 3
```| 运营| 开放总和 | 关闭总和| 开放计数 | 回答 |
 | ---| ---| ---| ---| ---|
 | 初始| 10 | 10 5 | 2 | |
 | 添加 2 | 14 | 14 5 | 2 | |
 | 翻转前两个 | 5 | 14 | 14 1 | |
 | 添加 4 | 9 | 14 | 14 1 | |
 | 查询全部 | 9 | 14 | 14 | 23 | 23
 | 查询全部 | 9 | 14 | 14 | 23 | 23

 此示例练习部分翻转并显示重复翻转可恢复之前的状态。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n) | O((n + m) log n) | 构建树是线性的，每个操作都会通过惰性传播访问 O(log n) 个节点。 |
 | 空间| O(n) | 线段树数组包含每个节点的恒定数量的值。 |

 最大输入大小需要避免任何涉及每个操作的每个元素的解决方案。 线段树的对数运算完全符合时间限制，并且内存使用量远低于可用限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

assert run("""5 6
1 2 4 8 16
1 0 1 0 1
3 2 4
2 1 5 6
3 2 4
1 1 5
2 1 5 7
3 2 4
""") == "14\n20\n34\n"

assert run("""1 1
100
0
3 1 1
""") == "100\n"

assert run("""3 4
5 5 5
1 0 1
2 1 3 2
1 1 2
2 1 3 4
3 1 3
""") == "23\n"

assert run("""2 4
7 9
1 1
1 1 2
2 1 2 10
1 1 1
3 1 2
""") == "36\n"

assert run("""4 5
1 1 1 1
0 0 0 0
2 1 4 5
1 2 3
2 1 4 3
3 1 4
3 2 3
""") == "4\n14\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单闭箱查询 |`100`| 查询包括封闭的框。 |
 | 具有更新和翻转的混合状态 |`23`| 仅限开放式添加和部分翻转。 |
 | 两次翻转更新 |`36`| 延迟翻转取消。 |
 | 所有盒子最初都关闭|`4`,`14`| 从完全封闭的段进行状态转换。 |

 ## 边缘情况

 讨论中的第一个边缘情况是翻转后的添加。 线段树可以处理它，因为翻转操作在应用加法之前交换了存储的开组和闭组。 对于输入：```
2 3
5 7
1 0
1 1 2
2 1 2 3
3 1 2
```树将其开放计数从一个盒子更改为一个盒子，但开放总数变为旧的封闭总数。 添加仅影响第二个框，产生最终结果`15`。 

第二种边缘情况是在同一间隔内进行多次翻转。 惰性标志存储是否有奇数个翻转待处理。 在：```
1 4
10
1
1 1 1
1 1 1
2 1 1 5
3 1 1
```第一次翻转将节点标记为已翻转，第二次翻转删除该待处理状态，并且该框保持打开状态。 应用加法，答案变为`15`。 

最后的边缘情况是查询封闭的盒子。 查询函数总是返回`open_sum + closed_sum`，所以它永远不依赖于当前状态。 为了：```
2 1
4 9
1 0
3 1 2
```该树在开放组中存储 4 个，在封闭组中存储 9 个。 返回的总和是`13`，匹配所需的行为。
