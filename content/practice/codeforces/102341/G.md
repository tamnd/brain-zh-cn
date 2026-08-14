---
title: "CF 102341G - 古杜尔"
description: "每层只能具有对游戏重要的四种稳定配置中的一种。 完整无损的层为 III。 具有两个块的层是 II。 或者.II，并且这两种情况具有相同的博弈行为，因此我们可以将它们视为一种状态。"
date: "2026-08-14T05:08:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "G"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 237
verified: true
draft: false
---

[CF 102341G - Gurdurr](https://codeforces.com/problemset/problem/102341/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每层只能具有对游戏重要的四种稳定配置中的一种。 完整完整的层是`III`。 具有两个块的层是`II.`或者`.II`，并且这两种情况具有相同的博弈行为，因此我们可以将它们视为一种状态。 两种单块配置是`I.I`和`.I.`。 

最后两种状态之间的关键区别在于，两者都是完全不可移动的，但是`.I.`影响它的邻居，因为另一个`.I.`不能与其相邻。 一个`I.I`层没有施加该限制。 

搬家自`III`可以移除外部块并将其变成`II.`或者`.II`，或者去掉中间的方块，把它变成`I.I`。 一个`II.`或者`.II`层可以移除其剩余的外部块并成为`.I.`，但仅当这不会创建两个相邻的单例层时。 一旦一层变成`I.I`或者`.I.`，它永远不会再改变。 

输入最多可提供 30,000 个独立塔。 对于每一座塔，`n`最多20个，依次是从上到下每层的三字配置。 我们只需要决定初始位置是先手获胜还是先手失败。 

小值`n <= 20`是主要线索。 直接的游戏状态搜索每层大约有四种可能性，给出的上限为`4^20 = 1,099,511,627,776`在考虑相邻单层之间的稳定性限制之前就需要进行稳定状态编码。 即使是记忆也无法使这一点变得可行。 我们需要利用这样一个事实：层之间的交互只是局部的，并且不可变的层会分割游戏。 

解决方案必须正确处理几种边缘情况。 单个`I.I`层没有合法的移动，因为删除任何一个外部块都会留下一个外部单例，所以它的答案是`Second`。 单个`.I.`层也是不可移动的，所以`1 / .I.`是`Second`。 单个`III`层有两种走法并且获胜，所以`1 / III`是`First`。 

另一个微妙的情况是旁边有一个完整的层`.I.`。 例如，```
2.I.III
```是`First`。 这`III`层有两个合法的移动：删除其中间块会创建`I.I`，同时移除外部块会创建`II.`或者`.II`。 在任一结果位置，更改的图层都不会进一步移动，因为它紧邻`.I.`。 因此，整个局部组件具有 Grundy 值 1。将每个完整层视为普通的独立层`III`层会给出错误的分解。 

第二个边界情况是两个单层。 输入如```
2.I..I.
```根本不允许，因为初始塔会不稳定。 不保留承诺的稳定性条件的粗心实现可能会尝试处理它并意外地允许非法移动。 

## 方法

 蛮力方法是用当前配置来表示每一层，枚举可以移除的每个块，拒绝使塔不稳定的移动，并递归地求解结果位置。 由于每一步都会移除一个方块，递归就会终止，并且通常的公正游戏递归会正确识别获胜和失败的位置。 记忆可以避免多次解决同一位置。 

问题在于职位数量。 即使允许每一层独立地有四个状态，也会有`4^20`， 关于`1.1 * 10^12`，可能的编码。 对状态空间的记忆搜索远远超出了限制。 如果没有记忆化，递归树会更大，因为可以通过不同的删除顺序达到相同的配置。 

关键的观察是`I.I`和`.I.`自己不能动。 这样的层将游戏永久地分成独立的部分。 固定分隔符后，仍然需要表示的唯一层是`III`和两块状态`II.`或者`.II`。 

存在一种边界效应。 一个`.I.`分隔符防止其直接邻居成为单例层。 如果这样的邻居已经是两个块层，则它变得完全不可移动。 如果是的话`III`，它只有一个有效的动作，并且它的 Grundy 值为 1。这让我们也可以从游戏的复杂部分中删除这些边界层。 

剩下的部分仅包含`III`和两块层。 编码`III`通过位 1 和`II.`或者`.II`按位 0. 长度的一段`m`现在由位掩码描述`m`位。 只有`2^m`这样的面具。 

对于每个掩码，我们可以直接从所有合法动作计算其 Grundy 值。 当一个`III`选择位置后，删除外部块会清除其位并保持段连接。 删除中间的块会创建`I.I`，它是一个不可移动的分隔符，因此剩余的前缀和后缀成为独立的游戏，并且它们的Grundy值被异或。 

当选择两个方块的位置时，其唯一合法的移动是变成`.I.`。 这个新的单例会阻塞它的两个邻居。 因此，这些邻居从活动段中消失。 如果其中一位邻居是`III`，它贡献独立的 Grundy 值 1，因为它可以在变得不可移动之前精确地进一步移动。 

每个结果段都比当前段短，或者具有相同的长度但具有较小的掩码，因此可以按照增加的长度和掩码顺序来预先计算状态。 

由此产生的复杂性仅呈指数级增长`n`，不包括完整塔配置的数量。 和`n <= 20`，段状态总数为`2^1 + 2^2 + ... + 2^20 = 2^21 - 2`,

 每个州最多审查20个职位。 这是预期的`O(n 2^n)`预处理，然后对每个输入塔进行线性处理。 相同`O(2^n n + tn)`复杂性是通过问题的独立竞赛分析来描述的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解与记忆 |`O(n 4^n)`在最坏的情况下|`O(4^n)`| 太慢了|
 | 最佳 SG 预处理 |`O(n 2^n + tn)`|`O(2^n)`| 已接受 |

 ## 算法演练

 1.读取每一层并将其分类为`F`,`D`,`T`， 或者`S`， 在哪里`F = III`,`D = II.`或者`.II`,`T = I.I`， 和`S = .I.`。 双块状态的两个方向是等效的，因为两者都恰好有一种可能的移除并成为中间的单例。 
2. 标记每个`T`和`S`作为分隔符。 还要标记每个的邻居`S`。 单例的邻居无法执行会在其旁边创建另一个单例的移动。 
3.每一个标记`F`旁边一个`S`贡献 Grundy 值 1。这样的层有两个合法的移除，一个产生`T`和其他生产`D`; 两个结果状态都是不可移动的，因为该层仍然紧邻`S`。 因此它的选项都具有 Grundy 值 0，给出`mex{0} = 1`。 
4. 扫描未标记的层并将其分割为最大的段。 该段中的每一层都是`F`或者`D`，所以编码`F`作为位 1 和`D`作为位 0。将每个段的预先计算的 Grundy 值异或到答案中。 
5. 预先计算一段长度`m`， 让`sg[m][mask]`为其 Grundy 值。 对于每个职位`k`，检查其位。 
6.如果有位`k`为1，层数为`F`。 删除外部块将其更改为`D`，给状态以位`k`已清除。 删除中间块将其更改为`T`，它将剩余位置分成独立的左段和独立的右段。 将两个生成的 Grundy 值添加到 mex 集中。 
7.如果被咬了`k`为 0 时，层数为`D`。 它唯一的举动将其更改为`S`。 该单例建仓`k-1`和`k+1`无法继续进入单例状态，因此它们被从活动游戏中删除。 邻近的一个`F`只剩下一步并贡献 1，而相邻的`D`没有任何贡献。 这些邻居之外的部分仍然是独立的段。 
8. 取合法移动获得的所有 Grundy 值的混合值。 那是`sg[m][mask]`。 
9. 整个塔是扫描过程中发现的各个组件的不相交总和。 根据 Sprague-Grundy 定理，当所有分量 Grundy 值的 XOR 不为零时，第一个玩家获胜。 

### 为什么它有效

 不变的是每个活动段仅包含`III`和两块层，而段之外的每一层都已经是不可移动的，或者是由以下原因引起的直接边界效应：`.I.`。 一个`III`move 要么停留在同一个段内，要么创建`I.I`并将其分开。 两个方块的移动创建`.I.`并将其两个邻居从未来的交互中删除。 因此，来自段的每个合法移动精确地对应于循环使用的转换之一，并且循环产生的每个转换对应于合法移动。 

自从`I.I`和`.I.`无法移动，被它们分开的不同组件再也不会相互作用。 因此，它们的 Grundy 值通过 XOR 组合。 预先计算的`sg`因此，值是每个分量的精确 Grundy 值，而最终异或为零正是失败位置的条件。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def build_sg(max_n):    # sg[m][mask] = Grundy value of a segment of length m.    # A bit 1 means III, a bit 0 means II. or .II.    sg = [bytearray(1 << m) for m in range(max_n + 1)]
    # Empty segment.    sg[0][0] = 0
    for m in range(1, max_n + 1):        cur = sg[m]
        for mask in range(1 << m):            seen = 0
            for k in range(m):                bit = 1 << k
                if mask & bit:                    # Move 1: III -> II. / .II.                    g = cur[mask ^ bit]                    seen |= 1 << g
                    # Move 2: III -> I.I.                    # The new I.I. is immovable and separates                    # the prefix and suffix.                    left_len = k                    left_mask = mask & (bit - 1)
                    right_len = m - k - 1                    right_mask = mask >> (k + 1)
                    g = sg[left_len][left_mask] ^ sg[right_len][right_mask]                    seen |= 1 << g
                else:                    # Move: II. / .II -> .I.                    # The new singleton blocks its immediate neighbors.                    g = 0
                    # Active part strictly to the left of k-1.                    if k >= 2:                        left_len = k - 1                        left_mask = mask & ((1 << (k - 1)) - 1)                        g ^= sg[left_len][left_mask]
                    # If k-1 exists and is III, it has exactly one                    # remaining move after k becomes a singleton.                    if k >= 1 and (mask & (1 << (k - 1))):                        g ^= 1
                    # Active part strictly to the right of k+1.                    if k + 2 < m:                        right_len = m - k - 2                        right_mask = mask >> (k + 2)                        g ^= sg[right_len][right_mask]
                    # Symmetric boundary contribution.                    if k + 1 < m and (mask & (1 << (k + 1))):                        g ^= 1
                    seen |= 1 << g
            # mex(seen)            g = 0            while seen & (1 << g):                g += 1
            cur[mask] = g
    return sg

def solve(data):    it = iter(data.split())    t = int(next(it))
    tests = []    max_n = 0
    for _ in range(t):        n = int(next(it))        layers = [next(it).decode() for _ in range(n)]        tests.append((n, layers))        max_n = max(max_n, n)
    sg = build_sg(max_n)
    out = []
    for n, layers in tests:        # 0 = singleton .I.        # 1 = I.I        # 2 = II. or .II        # 3 = III        a = [0] * n
        for i, s in enumerate(layers):            if s == b"III":                a[i] = 3            elif s == b".I.":                a[i] = 0            elif s == b"I.I":                a[i] = 1            else:                a[i] = 2
        # Mark layers that cannot belong to an ordinary active segment.        blocked = [False] * n
        for i in range(n):            if a[i] == 0:                blocked[i] = True                if i > 0:                    blocked[i - 1] = True                if i + 1 < n:                    blocked[i + 1] = True            elif a[i] == 1:                blocked[i] = True
        answer = 0        mask = 0        length = 0
        for i in range(n):            # A full layer adjacent to .I. is an independent SG-1 game.            if blocked[i] and a[i] == 3:                answer ^= 1
            if not blocked[i]:                # III -> 1, II. / .II -> 0                mask = (mask << 1) | (a[i] - 2)                length += 1            else:                if length:                    answer ^= sg[length][mask]                    length = 0                    mask = 0
        if length:            answer ^= sg[length][mask]
        out.append("First\n" if answer else "Second\n")
    return "".join(out)

def main():    data = sys.stdin.buffer.read().splitlines()    sys.stdout.write(solve(b"\n".join(data)))

if __name__ == "__main__":    main()
```预处理存储一个`bytearray`对于每个段的长度。 在 Python 中使用字节数组很重要，因为大约有`2^21`预先计算的状态总数，并且每个 Grundy 值都很小。 每个表条目的普通 Python 整数对象将消耗更多的内存。 

循环遵循两种实际的移动类型。 对于设定位，`mask ^ bit`表示从中移除外部块`III`，而前缀和后缀掩码表示删除中间块并生成`I.I`。 对于零位，所选的两块层变为`.I.`，因此直接邻居被排除在剩余的活动段之外。 

左右掩码使用从零开始的位置。 选择位置后`k`，左侧活动部分结束于`k - 2`，而右侧的活动部分开始于`k + 2`。 这就是为什么两块转换使用`k - 1`和`k + 2`计算剩余线段长度时。 这些是最有可能出现差一错误的地方。 

输入被读取`sys.stdin.buffer`，这在这里很有用，因为可以有 30,000 个测试用例。 预处理仅进行到最大的`n`出现在输入中，因此小测试文件不会支付不必要的状态。 

这`seen`变量是一个整数位集。 如果可达位置具有 Grundy 值`g`， 少量`g`已设置。 然后计算 mex 只需找到第一个未设置的位。 这避免了为大约 200 万个状态中的每一个分配临时 Python 集。 

## 工作示例

 ### 示例 1

 考虑第一个样本的第一个和第五个案例。 

对于第一种情况，只有一个`III`层。 对应的一位段有掩码`1`。 

| 线段长度 | 面膜| 意义| 可实现的 Grundy 价值观 | 新加坡 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 |`II.`|`{0}`| 1 |
 | 1 | 1 |`III`|`{1, 0}`| 2 |

 这`III`层可以成为两块层，其SG为1，也可以成为`I.I`，其 SG 为 0。因此其 SG 为`mex{0,1} = 2`，它是非零的，所以输出是`First`。 

对于第五种情况，塔是两层。 

| 线段长度 | 面膜| 意义| 新加坡 |
 | --- | --- | --- | --- |
 | 1 | 1 |`III`| 2 |
 | 2 | 3 |`III / III`| 1 |

 对于两层状态，移除外部块会留下 SG 0 的状态，而移除中间块会将塔分成两个单层`III`与 SG 的游戏`2 xor 2 = 0`。 可到达的 SG 值包括 0 但不包括 1，因此 SG 为 1。最终的 XOR 不为零，因此答案为`First`。 

这些痕迹表明了为什么要治疗`III`因为仅仅“剩余两步”是不够的。 它的两个动作导致未来相互作用不同的位置，因此需要完整的格伦迪递归。 

### 示例 2

 第二个样本是```
3II..IIIII
```两个双块层都编码为 0，整个层编码为 1，给出 mask`100`如果在二进制结构中从上到下读取。 

这三种可能的动作更容易直接理解。 

| 所选图层 | 当前状态 | 结果游戏 | 结果 SG |
 | --- | --- | --- | --- |
 | 1 |`II.`|`.I.`阻止第 2 层，留下一层`III`组件| 2 |
 | 2 |`.II`|`.I.`阻止第 1 层和第 3 层，留下一个独立的完整层 | 1 |
 | 3、外观|`III`| 三个两块层| 1 |
 | 3、中|`III`|`I.I`将两个两块层分开 | 1 |

 可达的 Grundy 值的集合是`{1, 2}`，因此当前位置的 SG 值为 0。因此，第一个玩家输了，给出`Second`。 

这个例子练习了递归中最微妙的过渡：当两个块层变成`.I.`，它的直接邻居随后不能成为单例层。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 预处理时间|`O(n 2^n)`| 有`2^m`每个人的口罩`m <= n`，每个掩模最多检查`m`职位|
 | 每个测试用例 |`O(n)`| 塔楼分类扫描一次 |
 | 总时间 |`O(n 2^n + tn)`| 预处理由所有测试用例共享 |
 | 空间|`O(2^n)`| SG表包含`2^(n+1) - 1`字节条目高达常数因子|

 为了`n = 20`，预处理大约有 200 万个段状态，每个状态最多 20 个转换。 使用紧凑字节数组可以保持较小的内存占用，而与共享预处理相比，每个测试用例的线性工作可以忽略不计。 

## 测试用例```python
Pythonimport ioimport sys

def run(inp: str) -> str:    return solve(inp.encode()).strip()

# The solve() and build_sg() functions from the submitted solution# are assumed to be defined above.

sample1 = """\51III1I.I1.I.1.II2IIIIII"""
assert run(sample1) == """\FirstSecondSecondFirstFirst""".strip(), "sample 1"
sample2 = """\13II..IIIII"""
assert run(sample2) == "Second", "sample 2"

# Minimum-size positions.assert run("""\41III1II.1I.I1.I.""") == """\FirstFirstSecondSecond""".strip(), "single-layer states"

# Two full layers have SG 1, so the position is winning.assert run("""\12IIIIII""") == "First", "two full layers"

# Two full layers separated by singleton layers become two# independent SG-1 components, so their XOR is zero.assert run("""\13III.I.III""") == "Second", "singleton boundary decomposition"

# Maximum n, all layers are immovable I.I.assert run(    "1\n20\n" + "\n".join(["I.I"] * 20) + "\n") == "Second", "maximum-size all-equal terminal tower"

# Boundary case: a full layer immediately next to .I. has SG 1.assert run("""\12.I.III""") == "First", "full layer next to singleton"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / III`,`1 / II.`,`1 / I.I`,`1 / .I.`|`First, First, Second, Second`| 最小尺寸和所有四个基本层状态 |
 |`III / III`|`First`| 两个活动全层之间的交互 ​​|
 |`III / .I. / III`|`Second`| 独立组件由单例分隔 |
 | 二十`I.I`层|`Second`| 最大限度`n`、所有相同的终端层以及内存安全的预处理 |
 |`.I. / III`|`First`| 与单例边界相邻的完整层的特殊处理 |

 ## 边缘情况

 单个`I.I`层是终端。 唯一剩下的块是两个外部块，删除任何一个都会留下一个外部块，这违反了图层规则。 该算法将其分类为分隔符，不创建活动段，并将 XOR 保留为零。```
1I.I
```执行将层标记为阻塞，找不到活动层，并输出`Second`。 

单个`.I.`层也是终端。 在留下有效的非空层的同时，没有可以删除的块，因此该算法再次不创建活动段。```
1.I.
```答案是`Second`。 

旁边有一个完整的层`.I.`需要特殊处理。 考虑```
2.I.III
```单例将自己及其邻居标记为被阻止。 这`III`因此，层不被放入普通段DP中。 相反，它贡献 XOR 值 1。它的两个可能的移动都产生不可移动状态，因此它的 SG 值实际上是 1。最终的 XOR 不为零，算法输出`First`。 

最后，考虑示例 2 配置：```
3II..IIIII
```最初不存在单例，因此所有三层都属于一个活动段。 面具是`100`。 选择前两个零位中的任何一个都会创建`.I.`并阻止其邻居，同时选择最终的完整层，将其更改为两个块层或创建`I.I`并分割该段。 生成的 Grundy 值为 2、1 和 1，给出 mex 0。算法因此输出`Second`，完全按照要求。
