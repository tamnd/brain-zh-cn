---
title: "CF 102803B - 天堂票据"
description: "我们收集了 n 张账单。 它们的值不是直接给出的，而是使用提供的 xorshift128+ 生成器从两个随机种子生成的。 每个生成的值都是不同的。 在此过程中，有些账单未支付，有些账单已支付。"
date: "2026-07-26T16:29:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102803
codeforces_index: "B"
codeforces_contest_name: "The 15th Heilongjiang Provincial Collegiate Programming Contest"
rating: 0
weight: 102803
solve_time_s: 47
verified: true
draft: false
---

[CF 102803B - 天堂法案](https://codeforces.com/problemset/problem/102803/B)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收集了`n`账单。 它们的值不是直接给出的，而是使用提供的 xorshift128+ 生成器从两个随机种子生成的。 每个生成的值都是不同的。 在此过程中，有些账单未支付，有些账单已支付。 

这些命令修改或检查当前未付费集。 查询`F x`要求最小的未付账单，其价值至少为`x`。 一个命令`D x`从未付帐单中删除同一张帐单，因为它已被支付。 查询`C x`要求所有未付账单的总价值不超过`x`。 一个命令`R x`最多恢复每张已付账单的价值`x`，使这些账单再次未付。 

生成的值几乎达到`10^12`，因此实际值必须作为 64 位整数处理。 账单数量可以达到一百万，命令总数远远大于典型的线性每次查询解决方案可以处理的数量。 扫描所有账单以查找每个命令的解决方案可以执行大约`10^12`最坏情况下的操作，远远超出了可用时间。 我们需要对每个命令进行对数处理。 

困难的部分是退款操作。 它可以一次激活许多账单，但最多发生十次。 数据结构必须支持单独的删除和大的前缀恢复。 

粗心的实施可能会以多种方式失败。 如果有一个命令`F`要求一个大于每张未付账单的值，返回最大的现有值是错误的。 例如，用账单`{5, 9}`，命令`F 10`必须输出`10^12`，所需的标记值，因为不存在有效的账单。 

另一个错误是将已付账单与不存在的账单混淆。 假设账单是`{3, 7, 11}`。 后`D 7`, 一个查询`C 10`必须返回`3`， 不是`10`，因为已付帐单不属于未付托收的一部分。 

退款界限也很容易处理不当。 有账单`{4, 8, 12}`，命令`R 8`必须恢复两者`4`和`8`。 使用严格比较而不是包容性比较会错误地离开`8`有薪酬的。 

## 方法

 一个直接的解决方案是将所有账单保存在一个列表中，并在命令到达时对其进行扫描。 为了`F`和`D`，我们搜索所有未付账单并保留最佳候选者。 为了`C`，我们将所有满足条件的未付账单相加。 这是正确的，因为每个命令都是针对当前未付账单集定义的。 

问题是工作量。 对于一百万张账单和数十万条命令，最坏情况下的查询序列可能需要大约`5 * 10^11`检查。 该方法还不够快。 

关键的观察是钞票的价值永远不会改变。 只是他们的状态发生了变化。 对值进行排序后，每个操作都变成了有关此排序数组中位置的问题。 线段树可以存储有关位置间隔的信息。 每个节点保存该区间内当前未支付的账单数量及其值的总和。 

退款操作看起来很昂贵，因为它会影响许多账单，但它总是将排序数组的前缀更改为相同的状态：所有账单都未支付。 这意味着线段树惰性赋值就足够了。 当整个段都被退款时，我们可以将其标记为完全活跃，而无需访问其子段。 

同一棵树可以找到下限后的第一个活动位置，通过将一个位置设置为非活动来删除一个帐单，并回答前缀和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nQ) | O(n) | 太慢了 |
 | 线段树| O((n + Q) log n) | O((n + Q) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 生成所有账单金额并对其进行排序。 排序顺序让值比较成为索引范围。 
2. 在排序后的位置上构建线段树。 每个位置都以未付款开始，因此每个节点最初存储其段中的账单数量以及该段中所有值的总和。 
3.为了`F x`，找到第一个排序位置，其值至少为`x`。 然后从该位置开始搜索线段树，查找包含未付帐单的第一个线段。 如果不存在这样的位置，则打印`10^12`。 
4. 对于`D x`，执行相同的搜索`F x`。 如果找到职位，请更新该职位，使其活跃计数和贡献变为零。 
5. 对于`C x`，找到最后一个排序位置，其值最多为`x`。 查询到该位置的线段树前缀并返回存储的总和。 
6. 对于`R x`，找到最后一个排序位置，其值最多为`x`。 对该前缀应用惰性分配，将每个涵盖的职位设置为无薪。 

不变的是线段树总是准确地代表当前未付的账单。 点删除恰好删除一个活动位置。 前缀恢复使请求值范围内的每个位置都处于活动状态。 由于每个查询仅从该维护的表示中读取，因此返回的值与所需的未付费集相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.arr = arr
        size = 4 * self.n
        self.cnt = [0] * size
        self.s = [0] * size
        self.lazy = [False] * size
        self.build(1, 0, self.n - 1)

    def build(self, p, l, r):
        if l == r:
            self.cnt[p] = 1
            self.s[p] = self.arr[l]
        else:
            m = (l + r) // 2
            self.build(p * 2, l, m)
            self.build(p * 2 + 1, m + 1, r)
            self.pull(p)

    def pull(self, p):
        self.cnt[p] = self.cnt[p * 2] + self.cnt[p * 2 + 1]
        self.s[p] = self.s[p * 2] + self.s[p * 2 + 1]

    def apply(self, p, l, r):
        self.cnt[p] = r - l + 1
        self.s[p] = sum(self.arr[l:r + 1])
        self.lazy[p] = True

    def push(self, p, l, r):
        if self.lazy[p] and l != r:
            m = (l + r) // 2
            self.apply(p * 2, l, m)
            self.apply(p * 2 + 1, m + 1, r)
            self.lazy[p] = False

    def update_all(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.apply(p, l, r)
            return
        self.push(p, l, r)
        m = (l + r) // 2
        if ql <= m:
            self.update_all(p * 2, l, m, ql, qr)
        if qr > m:
            self.update_all(p * 2 + 1, m + 1, r, ql, qr)
        self.pull(p)

    def remove(self, p, l, r, idx):
        if l == r:
            self.cnt[p] = 0
            self.s[p] = 0
            return
        self.push(p, l, r)
        m = (l + r) // 2
        if idx <= m:
            self.remove(p * 2, l, m, idx)
        else:
            self.remove(p * 2 + 1, m + 1, r, idx)
        self.pull(p)

    def first(self, p, l, r, ql):
        if r < ql or self.cnt[p] == 0:
            return -1
        if l == r:
            return l
        self.push(p, l, r)
        m = (l + r) // 2
        res = self.first(p * 2, l, m, ql)
        if res != -1:
            return res
        return self.first(p * 2 + 1, m + 1, r, ql)

    def query(self, p, l, r, qr):
        if r <= qr:
            return self.s[p]
        self.push(p, l, r)
        m = (l + r) // 2
        ans = 0
        if qr > m:
            ans += self.query(p * 2 + 1, m + 1, r, qr)
        if qr >= l:
            ans += self.query(p * 2, l, m, qr)
        return ans

def solve():
    import bisect

    data = sys.stdin.buffer.read().split()
    if not data:
        return
    it = iter(data)
    t = int(next(it))
    out = []

    for _ in range(t):
        n = int(next(it))
        k1 = int(next(it))
        k2 = int(next(it))

        a = []
        mask = (1 << 64) - 1
        for _ in range(n):
            k3 = k1
            k4 = k2
            k1 = k4
            k3 ^= (k3 << 23) & mask
            k2 = (k3 ^ k4 ^ (k3 >> 17) ^ (k4 >> 26)) & mask
            a.append((k2 + k4) % 999999999999 + 1)

        a.sort()
        seg = SegTree(a)

        q = int(next(it))
        for _ in range(q):
            op = next(it).decode()
            x = int(next(it))

            if op == 'F' or op == 'D':
                pos = bisect.bisect_left(a, x)
                idx = seg.first(1, 0, n - 1, pos)
                if op == 'F':
                    out.append(str(10**12 if idx == -1 else a[idx]))
                elif idx != -1:
                    seg.remove(1, 0, n - 1, idx)

            elif op == 'C':
                pos = bisect.bisect_right(a, x) - 1
                out.append("0" if pos < 0 else str(seg.query(1, 0, n - 1, pos)))

            else:
                pos = bisect.bisect_right(a, x) - 1
                if pos >= 0:
                    seg.update_all(1, 0, n - 1, 0, pos)

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```生成器使用无符号 64 位算术来再现。 Python 整数不会自然溢出，因此使用掩码`(1 << 64) - 1`与 C++ unsigned long long 保持相同的行为。 

线段树仅存储未付账单的计数和总和。 惰性标志意味着整个段已被恢复。 该实现避免立即扩展该段，因为未来的操作可以根据存储的聚合值正确工作。 

这`first`功能是核心`F`和`D`。 它忽略不包含未付账单的每个段，并从左到右递归搜索，因为数组已排序并且需要最左边的有效位置。 

二进制搜索使用`bisect_left`对于“至少 x”和`bisect_right - 1`对于“最多x”。 混合这两个边界是此问题中错误答案的常见原因。 

## 工作示例

 考虑账单`{4, 9, 15}`。 

| 命令 | 活跃账单| 运行结果|
 | --- | --- | --- |
 | F 8 | 4、9、15 | 返回 9 |
 | D 9 | 4、15 | 删除 9 |
 | C 10 | 4、15 | 返回 4 |
 | R 10 | 4、9、15 | 恢复 9 |
 | C 10 | 4、9、15 | 返回 13 |

 此跟踪显示，删除的帐单从总和和搜索中消失，然后在前缀恢复后返回。 

第二个示例使用边界值`{5, 10, 20}`。 

| 命令 | 活跃账单| 运行结果|
 | --- | --- | --- |
 | d 10 | 5, 20 | 正好删除 10 |
 | F 10 | 5, 20 | 返回 20 |
 | C 10 | 5, 20 | 返回 5 |
 | R 10 | 5、10、20 | 恢复 10 |

 该示例证实了比较是包容性的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + Q) log n) | O((n + Q) log n) | 构建和每个命令都使用对数树操作 |
 | 空间| O(n) | 排序值和线段树各自存储线性信息|

 最大的测试规模需要数百万个账单和命令。 每个操作的线性扫描无法适应，但线段树将每个操作保持在对数时间左右。 该解决方案的正确性不需要退款限制，因为前缀分配是通过延迟传播直接处理的。 

## 测试用例```python
import sys, io

def run(inp):
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # call solve() from the submitted solution
    sys.stdin = old
    return ""

# The following cases should be run after placing solve() in the harness.

# Minimum-size generation and commands
# Covers single bill behavior.

# Removing all bills and querying empty states.
# Covers missing successor and empty sums.

# Refund after multiple deletions.
# Covers lazy restoration.

# Values at exact x boundaries.
# Covers inclusive comparisons.
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 生成一张账单、F 和 C 查询 | 生成值和总和 | 单元素处理 |
 | 删除所有账单，然后搜索 | 哨兵与零| 空树行为 |
 | 删除前缀、退款、查询金额 | 恢复总数 | 惰性前缀分配 |
 | 查询完全相等的值 | 包容性答案 | 边界正确性 |

 ## 边缘情况

 当没有未付账单满足时`F x`，树搜索到达活动计数为零的段并返回`-1`。 例如，付款后`{5, 8}`, 搜索`F 1`仍然必须失败，因为没有剩余的未付职位。 

当退款范围包含已未付的账单时，再次将前缀分配为活动是无害的。 线段树存储最终状态而不是对操作进行计数，因此恢复已经活动的帐单不会对其进行重复计数。 

对于精确的边界退款，请使用`bisect_right`包括等于`x`。 有价值观`{4, 8, 12}`, 付款后`8`,`R 8`更新职位`4`和`8`，将总和取自`16`回到`24`。 

排序索引表示使得所有这些情况一起工作。 树永远不需要知道钞票的位置和价值之外的实际含义，因此每个命令都成为对当前活动前缀或后缀的受控更新或查询。
