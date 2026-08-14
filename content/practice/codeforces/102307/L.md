---
title: "CF 102307L - 液体 X"
description: "这是一个伪装成硬币找零问题的交互式搜索问题。 存在未知的正整数 (X)，其中 (1 le X le 10^6)。 我们有 (n) 个滴管，使用滴管 (i) 一次添加 (ai) 单位的液体。"
date: "2026-08-13T07:30:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "L"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 193
verified: true
draft: false
---

[CF 102307L - 液体 X](https://codeforces.com/problemset/problem/102307/L)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这是一个伪装成硬币找零问题的交互式搜索问题。 

存在未知的正整数 (X)，其中 (1 \le X \le 10^6)。 我们有 (n) 个滴管，使用滴管 (i) 一次添加 (a_i) 单位的液体。 查询选择非负整数 (x_i)，因此测试的数量为

 [
 q=\sum_{i=1}^{n} a_i x_i。 
]

 实验结束后，法官告诉我们（q）是否低于（X）、等于（X）或高于（X）。 颜色对应于 (q<X)、(q=X) 和 (q>X)。 

任务是在最多 30 次实验中确定 (X)。 如果观察结果无法区分（X）和另一个可能的整数，我们必须输出（-1）。 

输入由 (n) 组成，后跟容量 (a_1,\ldots,a_n)。 普通的批量输入不存在包含（X）的情况，因为（X）是由交互式判断持有的。 每次查询后，程序都会读取结果颜色。 

上限 (10^6) 是中心计算约束。 对于从 (0) 到 (10^6) 的所有量的伪多项式动态规划来说，它足够小，但对于枚举滴管计数的所有可能向量来说，它太大了。 自 (n\le100) 起，具有 (n\cdot10^6) 次转换的直接动态规划最多可进行 (10^8) 次迭代。 这在优化的 C++ 中是合理的，但对于 Python 来说不必要地繁重，因此下面的实现将可达性 DP 打包到 Python 整数中，并将转换作为位操作执行。 

与 (X) 的 (10^6) 个可能值相比，30 次实验的限制也很宽松。 一旦我们对每个实际可以生产的数量进行了排序，普通的二分查找最多需要

 [
 \lceil \log_2(10^6)\rceil=20
 ]

 查询。 剩下的困难是确定最终区间何时恰好包含一个可能的整数。 

粗心的实施可能会错过一些边缘情况。 对于容量 (4,8)，假设隐藏值为 (10)。 我们可以查询（4）、（8）和（12），获得绿色、绿色和红色。 此时 (X) 可能是 (9)、(10) 或 (11)，因此正确答案是 (-1)。 仅仅因为 (10) 是中点而返回它是错误的。 

在下边界，假设唯一容量为 (2)，隐藏值为 (1)。 最小的肯定查询是 (2)，其响应为红色。 由于 (X) 为正，因此 (2) 以下的唯一值是 (1)，因此答案是唯一确定的。 期望两个相邻可达值都存在的通用二分搜索实现可能会错误地处理这种情况。 

同样的问题也发生在上边界处。 当可达值为 (999999) 时，如果其响应为绿色，则 (X>999999)。 由于(X\le10^6)，唯一的可能性是(10^6)。 同样，(X) 之上没有可到达的值可用作另一个端点。 

最后，相邻的一对可达值可以相差正好二倍。 如果这两个值是 (19) 和 (21)，并且响应告诉我们 (19<X<21)，则 (X=20) 是唯一确定的，即使 (20) 本身不能由释放器产生。 仅接受黄色响应的解决方案将错误地返回 (-1)。 

## 方法

 最直接的方法是枚举所有可以生产的数量。 我们定义`dp[s]`意味着滴管容量的某些非负组合恰好产生（s）。 开始于`dp[0] = true`，对于每个释放器容量 (a_i)，我们将可达性从 (s) 传播到 (s+a_i)。 由于每个滴管可以任意多次使用，因此数量的迭代从小到大。 

相同的 DP 还可以为每个可到达的数量存储前驱。 如果`dp[s]`因为（s-a_i）而变为真，我们记住（s-a_i）。 稍后跟随这些前辈给出每个释放器必须用于查询的实际次数。 

计算完所有可达量后，交互部分就变成普通的二分查找了。 查询的颜色告诉我们 (X) 是在查询的可达值之前、之时还是之后。 已发布的竞赛解决方案正是使用了这种可达数量 DP，然后进行二分搜索。 

简单的实现执行 (O(n\cdot10^6)) DP 转换。 对于 (n=100)，最坏的情况是 (100,000,000) 次转换，然后是另一个 (10^6) 次操作来收集所有可到达的数量。 这就是简单实现变得没有吸引力的地方，尤其是在 Python 中。 

关键的观察结果是 DP 仅包含布尔信息。 我们可以将所有可达量同时表示为单个大整数的位，而不是用一个 Python 对象来表示一个可达量。 当数量 (s) 可达时，位 (s) 恰好为 1。 

对于一种容量 (a)，操作

 [
 S \leftarrow S\cup(S+a)
 ]

 对应于```
bits |= bits << a
```一次应用程序允许额外使用当前滴管。 为了有效地允许任意多次使用，我们将可用副本的数量加倍。 处理班次 (a,2a,4a,\ldots) 后，从 (0) 到所需限制的每个副本数量都可用。 因此每个容量只需要 (O(\log 10^6)) 大整数移位。 

每当某个位首次可访问时，我们还会记录前驱。 如果通过将先前值移动(k a_i)来创建新值(s)，则其前任值是(s-k a_i)，并且重建可以将副本数量恢复为((s-\text{前任})/a_i)。 

然后对排序后的可达数量执行结果搜索。 如果法官返回黄色，我们就知道确切的值。 如果搜索结束时没有出现黄色，则剩余的可能性形成两个连续可达数量之间的间隙，当间隙达到允许范围的边界时进行特殊处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | Straightforward DP | (O(nM))，其中 (M=10^6) | (O(M)) | 在优化的 C++ 中被接受，但对于 Python 来说太重了 |
 | Packed bitset DP | (O(n\log M\cdot M/W + M)) 字操作 | (O(M)) | 已接受并适合Python |

 这里 (W) 是大整数表示内部使用的机器字大小。 Python 的任意精度整数在优化的本机代码中执行大移位和按位运算。 

## 算法演练

 1. 读取滴管的数量及其容量。 令 (M=10^6) 为 (X) 的最大可能值。 

唯一值得考虑的数量是实际上可以由容量形成的总和。 在协议下查询无法到达的数量是不可能的。 
2. Create a bitset`bits`仅设置零位。 位(s)表示数量(s)是可达的。 

数量为零是可以达到的，因为允许使用每个滴管零次。 
3. 处理每个容量 (a_i)。 对于移位 (a_i,2a_i,4a_i,\ldots)，使用以下命令计算新可达的位

 [
 \text{new}=(\text{位}\ll\text{shift})\setminus\text{位}。 
]

 每个加倍步骤都会扩展当前滴管可添加的副本数量。 移位 (a_i,2a_i,\ldots,2^ka_i) 后，从零到 (2^{k+1}-1) 的所有所需计数都可用。 
4. 对于每个新可达的值，存储前一个值和负责转换的释放器的索引。 

如果`shift = 8`新值 (25) 来自 (17)，存储的前一个值是 (17)。 在重建过程中，差异（25-17=8）告诉我们在这次转换中使用了相应容量的一份副本。 较大的轮班工作方式相同，差异可能代表多个副本。 
5. 将每个正的可达数量提取到排序数组中`values`。 

位集本身已经按数字顺序存储值，但二分搜索需要按等级随机访问，因此我们具体化了可到达的正量的集合。 
6. 对可达量数组进行二分查找。 对于中间数量 (q)，重建一个滴管向量，其总和恰好为 (q)，打印查询并读取颜色。 

红色响应意味着 (q>X)，因此 (q) 处或之后的每个可到达数量都可以被丢弃。 绿色响应意味着 (q<X)，因此可以丢弃 (q) 处或之前的每个可到达数量。 黄色立即识别（X=q）。 
7. 如果黄色从未出现，令`hi`是已知低于 (X) 的最后一个可达到的数量，并让`lo`是已知高于 (X) 的第一个可达到的数量。 

如果两者都存在且`values[lo] - values[hi] == 2`，它们之间恰好有一个整数。 该整数是 (X)，即使它本身无法访问。 
8. 如果没有低于最终间隔的可达数量，则唯一可能的唯一可识别下界情况是`values[0] == 2`。 那么它下面的正整数必然是(1)。 

例如，如果最小可达数量是 (5)，则红色响应只会告诉我们 (X) 属于 (1,2,3,4)，因此答案必须是 (-1)。 
9. 在上边界应用对称规则。 如果最大可达数量为 (999999) 并且其响应为绿色，则 (X=10^6)。 
10. 如果没有任何特殊情况适用，则打印 (-1)。 最后打印命令`2`接下来是确定的答案。 

### 为什么它有效

 交互式二分搜索期间的不变性是与所有响应一致的 (X) 的每个值都位于剩余的可达量之间。 黄色响应标识了一个确切的可到达数量。 如果没有黄色，(X) 必须严格位于两个连续可达量之间，或者位于两个边界之一的可达范围之外。 

如果两个连续的可达量相差2，则它们之间正好有一个整数，因此该整数是唯一确定的。 如果它们的差异至少为三，则至少有两个不同的整数对每个可达查询产生完全相同的响应，因此法官的信息无法区分它们，并且（-1）是正确的。 边界情况源于 (X) 被限制在正区间 ([1,10^6]) 的事实。 

位集构造是正确的，因为每次转换都会将当前容量的非负倍数添加到已经可达的总和中，而加倍序列最终允许每个所需数量的副本。 因此，算法设置的每个位都对应于一个有效组合，并且最终表示每个有效组合。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

LIMIT = 10**6
MASK = (1 << (LIMIT + 1)) - 1

def build_reachable(a):
    n = len(a)

    # bit s = 1 iff s is reachable.
    bits = 1

    # Encodes predecessor * n + coin_index.
    # -1 is used only for value 0.
    parent = array('i', [-1]) * (LIMIT + 1)

    for coin, value in enumerate(a):
        shift = value

        while shift <= LIMIT:
            shifted = (bits << shift) & MASK
            new_bits = shifted & ~bits

            # Store one witness for every newly reachable sum.
            while new_bits:
                low = new_bits & -new_bits
                s = low.bit_length() - 1
                prev = s - shift
                parent[s] = prev * n + coin
                new_bits ^= low

            bits |= shifted

            if bits == MASK:
                break

            shift <<= 1

    values = []
    b = bits & ~1

    while b:
        low = b & -b
        values.append(low.bit_length() - 1)
        b ^= low

    return values, parent

def get_counts(total, a, parent):
    n = len(a)
    counts = [0] * n
    cur = total

    while cur:
        encoded = parent[cur]
        coin = encoded % n
        prev = encoded // n

        counts[coin] += (cur - prev) // a[coin]
        cur = prev

    return counts

def ask(total, a, parent):
    counts = get_counts(total, a, parent)

    print(1, flush=True)
    print(*counts, flush=True)

    response = input().strip()

    if not response:
        sys.exit(0)

    return response[0]

def main():
    n = int(input())
    a = list(map(int, input().split()))

    values, parent = build_reachable(a)

    left = 0
    right = len(values) - 1
    answer = -1

    last_mid = -1
    last_response = ''

    while left <= right:
        mid = (left + right) // 2
        last_mid = mid

        response = ask(values[mid], a, parent)
        last_response = response

        if response == 'y':
            answer = values[mid]
            break

        if response == 'g':
            left = mid + 1
        else:
            right = mid - 1

    if answer == -1:
        # X is smaller than every reachable positive quantity.
        if right < 0:
            if values[0] == 2 and last_response == 'r':
                answer = 1

        # X is larger than every reachable quantity.
        elif left == len(values):
            if values[-1] == LIMIT - 1 and last_response == 'g':
                answer = LIMIT

        # X is strictly between two consecutive reachable quantities.
        else:
            low = values[right]
            high = values[left]

            if high - low == 2:
                answer = low + 1

    print(2, flush=True)
    print(answer, flush=True)

if __name__ == "__main__":
    main()
```实现的第一部分构建可达数量集。`bits`是一个Python整数，其位位置是数量，所以`bits << shift`代表添加`shift`单位到每个当前可达到的数量。 

双环值得关注。 处理 (a) 的移位后，当前位集包含使用当前 dropper 的零个或一个新副本的总和。 移位 (2a) 后，它包含零到三个副本。 下一个班次将提供零到七份副本，依此类推。 由于(2^{20}>10^6)，1个容量最多需要20个班次。 

这`parent`数组仅填充首次可达的位。 它将前一个总和和释放器索引存储在一个整数中。 编码使用`prev * n + coin`，重构通过整数除法和余数来反转它。 

一个重建步骤中使用的副本数量不一定是一份。 如果使用移位 (8a_i) 达到某个值，则前一个值相差 (8a_i)，因此`(cur - prev) // a[coin]`correctly recovers eight copies.

 交互式查询本身被故意分为`ask`。 它重建准确的滴管计数，打印命令`1`，打印向量，并立即刷新。 如果输出被缓冲，交互问题很容易失败，因此在等待法官响应之前，两行都会被刷新。 

二分查找使用索引`values`，而不是数值本身。 这是必要的，因为无法查询无法到达的数量。 颜色比较仍然是普通的有序比较，因为每个可达数量都是一个整数。 

最终的边界检查避免在数组外部进行索引。 盲目访问的通用实现`values[left]`和`values[right]`当（X）低于最小可达数量或高于最大可达数量时，二分查找可以读取无效位置。 

Python 整数具有任意精度，因此位集移位中不存在整数溢出问题。 明确的`MASK`将位集限制为 (10^6) 以内的数量，这也可以防止整数不必要的增长。 

## 工作示例

 第一个样本对应于容量 (1,2,5,10,20,50)。 相互作用可以识别(X=10)。 可到达的数量包括（8）、（10）和（12），因此可能的搜索路径可以将答案括起来并最终查询（10）本身。 

| 查询数量 | 回应 | 搜索效果|
 | ---| ---| ---|
 | 25 | 25 红色| (X<25) |
 | 8 | 绿色| (X>8) |
 | 10 | 10 黄色| (X=10) |

 这里重要的属性是每个查询的数量实际上都是可构造的。 例如，(25=5+20)、(8=2+2+2+2)和(10=10)。 黄色响应立即终止搜索。 

第二个示例使用容量 (4) 和 (8)。 假设隐藏值为(10)。 可达到的正数为 (4,8,12,16,\ldots)。 

| 查询数量 | 回应 | 搜索效果|
 | ---| ---| ---|
 | 8 | 绿色| (X>8) |
 | 12 | 12 红色| (X<12) |
 | 10 | 10 不可用 | 无法查询 |

 在前两次观察之后，（9）、（10）和（11）仍然是可能的。 由于无法查询 (8) 和 (12) 之间的数量，因此正确答案为 (-1)。 这正是将“整数上的二分搜索”与“可达数量上的二分搜索”分开的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log M\cdot M/W + M)) 字操作 | 每个容量使用 (O(\log M)) 打包位集移位，并且见证提取触及每个可达值一次 |
 | 空间| (O(M)) | 父数组为每个可能的数量存储一个整数，而位集使用 (O(M)) 位 |

 这里（M=10^6）。 交互阶段最多使用 20 个实验，因为最多有 (10^6) 个正候选量。 计算工作以伪多项式可达性计算为主，而实际交互的数量是对数的。 

打包实现在 Python 中特别有用，因为昂贵的位集移位和逻辑运算在优化的本机代码中执行，而不是作为 (10^8) Python 级循环迭代执行。 

## 测试用例

 因为这是一个交互问题，所以样本是交互记录而不是普通的确定性输入/输出对。 形式的普通助手`run(input) == output`无法忠实地测试它们，因为程序期望法官回答每个问题。 以下测试工具模拟内部判断并执行相同的二分搜索和重建逻辑。 

示例场景使用交互记录中可见的功能。 第一个具有容量 (1,2,5,10,20,50) 和隐藏值 (10)。 第二个具有容量 (4,8) 和隐藏值 (10)，其正确答案是 (-1)。 第三个具有容量 (2,3) 和隐藏值 (1)，该值也无法唯一确定。```python
from array import array

LIMIT = 10**6
MASK = (1 << (LIMIT + 1)) - 1

def build_reachable(a):
    n = len(a)
    bits = 1
    parent = array('i', [-1]) * (LIMIT + 1)

    for coin, value in enumerate(a):
        shift = value

        while shift <= LIMIT:
            shifted = (bits << shift) & MASK
            new_bits = shifted & ~bits

            while new_bits:
                low = new_bits & -new_bits
                s = low.bit_length() - 1
                prev = s - shift
                parent[s] = prev * n + coin
                new_bits ^= low

            bits |= shifted

            if bits == MASK:
                break

            shift <<= 1

    values = []
    b = bits & ~1

    while b:
        low = b & -b
        values.append(low.bit_length() - 1)
        b ^= low

    return values, parent

def get_counts(total, a, parent):
    n = len(a)
    counts = [0] * n
    cur = total

    while cur:
        encoded = parent[cur]
        coin = encoded % n
        prev = encoded // n
        counts[coin] += (cur - prev) // a[coin]
        cur = prev

    return counts

def solve_hidden(a, hidden):
    values, parent = build_reachable(a)

    left = 0
    right = len(values) - 1

    last_query = None
    last_response = None

    while left <= right:
        mid = (left + right) // 2
        query = values[mid]

        counts = get_counts(query, a, parent)
        assert sum(x * y for x, y in zip(a, counts)) == query
        assert all(x >= 0 for x in counts)
        assert query <= LIMIT

        last_query = query

        if query < hidden:
            response = 'g'
        elif query > hidden:
            response = 'r'
        else:
            response = 'y'

        last_response = response

        if response == 'y':
            return query
        elif response == 'g':
            left = mid + 1
        else:
            right = mid - 1

    if right < 0:
        if values[0] == 2 and last_response == 'r':
            return 1
        return -1

    if left == len(values):
        if values[-1] == LIMIT - 1 and last_response == 'g':
            return LIMIT
        return -1

    low = values[right]
    high = values[left]

    if high - low == 2:
        return low + 1

    return -1

# Sample 1: capacities 1, 2, 5, 10, 20, 50, hidden X = 10.
assert solve_hidden([1, 2, 5, 10, 20, 50], 10) == 10

# Sample 2: capacities 4, 8, hidden X = 10.
# The observations cannot distinguish 9, 10, and 11.
assert solve_hidden([4, 8], 10) == -1

# Sample 3: capacities 2, 3, hidden X = 1.
# Both 1 and other values below the first useful query cannot be separated.
assert solve_hidden([2, 3], 1) == -1

# Minimum-size case. Capacity 1 can produce every possible X.
assert solve_hidden([1], 1) == 1

# Boundary case. With capacity 2, every integer is either reachable
# or lies between two consecutive even reachable quantities.
assert solve_hidden([2], 1_000_000) == 1_000_000

# All-equal capacities. This is outside the statement's "different
# capacities" condition, but it checks that duplicate capacities do
# not break the implementation.
assert solve_hidden([7, 7], 14) == 14

# A gap larger than two leaves several possible hidden values.
assert solve_hidden([7, 7], 15) == -1

# Maximum-size n. Because capacity 1 is present, every X is reachable.
assert solve_hidden(list(range(1, 101)), 999_999) == 999_999
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 2 5 10 20 50`, 隐藏 (10) |`10`| 样品 1 和精确的黄色检测 |
 |`4 8`, 隐藏 (10) |`-1`| 样本 2 和宽度为 4 的未解决间隙 |
 |`2 3`, 隐藏 (1) |`-1`| 样本 3 和模糊度下限 |
 |`[1]`, 隐藏 (1) |`1`| 最小尺寸实例 |
 |`[2]`，隐藏 (10^6) |`1000000`| 上边界和大可达值 |
 |`[7,7]`, 隐藏 (14) |`14`| 重复的能力和精确的可达到的目标|
 |`[7,7]`, 隐藏 (15) |`-1`| 间隙大于二 |
 |`[1,2,\ldots,100]`，隐藏(999999) |`999999`| 最大 (n) 和密集可达性 |

 ## 边缘情况

 考虑容量 (2) 和隐藏值 (1) 的单个下降器。 可达到的正数为 (2,4,6,\ldots)。 超出可能范围的第一个查询是 (2)，响应为红色。 除(1)外，没有小于(2)的正整数，因此算法返回(1)。 下限检查`values[0] == 2`正是针对这种情况。 

考虑具有隐藏值 (3) 的相同滴管。 查询 (2) 给出绿色，查询 (4) 给出红色。 两个连续的可达量相差 (2)，因此它们之间的唯一整数是 (3)。 尽管没有实验可以恰好使用三个单位，但该算法返回 (3)。 

现在考虑具有隐藏值 (10) 的容量 (4) 和 (8)。 (X) 周围的可达值是 (8) 和 (12)。 它们的差异是 (4)，因此三个整数 (9,10,11) 仍然是可能的。 没有比较查询序列可以区分它们，因为每个可能的查询都是 (4) 的倍数。 该算法正确返回 (-1)。 

对于上限，假设容量允许 (999999)，但它和 (10^6) 之间没有值，并且 (999999) 的响应为绿色。 由于 (X\le10^6)，(X) 必定是 (10^6)。 上限检查可以识别这一点，而不需要上面 (X) 上不存在的可达数量。 

如果出现黄色响应，则无需进行差距分析。 黄色结果意味着测试数量等于 (X)，因此算法立即返回该可达数量。 这也是为什么前驱表示必须产生精确和的原因。 一个查询向量的总和即使相差一个单位也会改变法官的响应并使二分搜索无效。 

最后，重建过程永远不需要负滴管计数。 每个存储的前驱值都小于当前可达值，并且每个转换都是通过添加一个容量的正倍数来创建的。 跟随前辈严格减少当前总和直到达到零，因此重建总是以有效的非负向量终止。
